// src/hooks/useAuth.ts
import { create } from 'zustand';
import { authService } from '@/services/auth.service';
import { 
  User, 
  RegisterData, 
  LoginResponse, 
  RegisterResponse 
} from '@/types/usersTypes';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<RegisterResponse>;
  loginWithGoogle: () => void;
  handleGoogleCallback: (code: string) => Promise<void>; // Mantener para compatibilidad
  setTokensAndUser: (tokens: { access: string; refresh: string }, user: User) => void; // Nueva función
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }

      // Verificar el token y obtener datos del usuario
      const userData = await authService.getCurrentUser();
      set({ 
        user: userData,
        isAuthenticated: true,
        isLoading: false
      });
    } catch (error) {
      console.error('Error checking auth:', error);
      // Si hay un error, limpiamos el token y el estado
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ 
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await authService.login({ email, password });
  
      localStorage.setItem('token', response.access);
      localStorage.setItem('refreshToken', response.refresh);
  
      // ✅ Guarda el usuario directamente desde la respuesta
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false
      });
  
      return response; // ✅ Retorna también el usuario
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  

  // Función simplificada - solo redirige a Google
  loginWithGoogle: () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const googleAuthUrl = `${apiUrl}/auth/google/`;
    
    console.log('🚀 Redirigiendo a Google Auth...');
    console.log('URL:', googleAuthUrl);
    
    // Redirigir directamente a Google OAuth
    window.location.href = googleAuthUrl;
  },

  // Nueva función para establecer tokens y usuario directamente
  setTokensAndUser: (tokens: { access: string; refresh: string }, user: User) => {
    console.log('🔐 Estableciendo tokens y usuario:', { 
      access: tokens.access.substring(0, 20) + '...', 
      user: user.email 
    });
    
    // Guardar tokens en localStorage
    localStorage.setItem('token', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    
    // Actualizar estado
    set({ 
      user: user,
      isAuthenticated: true,
      isLoading: false
    });
  },

  // Mantener función original para compatibilidad (si necesitas el flujo directo)
  handleGoogleCallback: async (code: string) => {
    try {
      set({ isLoading: true });
      
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      console.log('🔍 Procesando callback de Google con código:', code.substring(0, 20) + '...');
      
      // Hacer petición al callback endpoint
      const response = await fetch(`${apiUrl}/auth/google/callback/?code=${code}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const data = await response.json();

      if (data.success) {
        console.log('🎉 Autenticación exitosa');
        
        // Guardar tokens
        localStorage.setItem('token', data.access);
        if (data.refresh) {
          localStorage.setItem('refreshToken', data.refresh);
        }

        // Establecer usuario
        set({ 
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        });
      } else {
        set({ isLoading: false });
        throw new Error(data.error || 'Error en autenticación');
      }
    } catch (error) {
      console.error('💥 Error procesando callback:', error);
      set({ isLoading: false });
      throw error;
    }
  },
        
  register: async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ 
      user: null, 
      isAuthenticated: false,
      isLoading: false
    });
  },

  updateUser: async (userData: Partial<User>) => {
    try {
      set({ isLoading: true });
      const updatedUser = await authService.updateUser(userData);
      set((state) => ({
        user: {
          ...state.user,
          ...updatedUser
        } as User,
        isLoading: false
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  }
}));