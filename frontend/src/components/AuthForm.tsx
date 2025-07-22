'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { ApiError } from '@/types/usersTypes';

interface AuthFormProps {
  type: 'login' | 'register';
}

interface FormError {
  field?: string;
  message: string;
}

export default function AuthForm({ type }: AuthFormProps) {
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    password: '',
    phone: '',
    nombre: '',
    apellido: '',
    rol: 'cliente', // valor por defecto
  });

  const [error, setError] = useState<FormError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { login, register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'login') {
        const response = await login(formData.email, formData.password);
        const user = response.user;

        if (user.rol === 'arrendador') {
          router.push('/app');
        } else if (user.rol === 'cliente') {
          router.push('/');
        } else {
          setError({ message: 'Rol no reconocido. Contacta al soporte.' });
        }


      } else {
        await register({
          nombre_usuario: formData.nombre_usuario || formData.email.split('@')[0], // crear aquí o pedir al usuario
          email: formData.email,
          password: formData.password,
          phone: formData.phone || undefined,
          rol: formData.rol,
          tipo_usuario: 'usuario', // siempre enviar este valor
          persona: {
            nombre: formData.nombre,
            apellido: formData.apellido,
          },
        });
        
        
        router.push('/app');
      }
    } catch (err: unknown) {
      console.error('Error en autenticación:', err);
      let errorMessage = 'Ha ocurrido un error inesperado';

      const apiError = err as ApiError;

      if (apiError.response?.data) {
        const data = apiError.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.detail) {
          if (typeof data.detail === 'string') {
            errorMessage = data.detail;
          } else if (Array.isArray(data.detail)) {
            errorMessage = data.detail[0];
          }
        } else if (typeof data === 'object') {
          const firstErrorKey = Object.keys(data)[0];
          const firstError = data[firstErrorKey];
          errorMessage = Array.isArray(firstError)
            ? firstError[0]
            : firstError.toString();
        }
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    setError(null);

    // Simplemente llama a loginWithGoogle que redirige
    loginWithGoogle();

  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error?.field === name) {
      setError(null);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Google OAuth Button */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isGoogleLoading || isLoading}
          className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isGoogleLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Redirigiendo a Google...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>
                {type === 'login' ? 'Iniciar sesión con Google' : 'Registrarse con Google'}
              </span>
            </div>
          )}
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">O continúa con</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading || isGoogleLoading}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading || isGoogleLoading}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
          />
        </div>

        {type === 'register' && (
          <>
            {/* Campo Nombre */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
              <input
                type="text"
                name="nombre"
                id="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

            {/* Campo Apellido */}
            <div>
              <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">Apellido</label>
              <input
                type="text"
                name="apellido"
                id="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:opacity-50"
              />
            </div>

            {/* Checkbox de Arrendador */}
            <div className="flex items-center">
              <input
                id="rol"
                name="rol"
                type="checkbox"
                checked={formData.rol === 'arrendador'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    rol: e.target.checked ? 'arrendador' : 'cliente',
                  }))
                }
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="rol" className="ml-2 block text-sm text-gray-900">
                Soy arrendador
              </label>
            </div>
          </>
        )}


        <button
          type="submit"
          disabled={isLoading || isGoogleLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>{type === 'login' ? 'Iniciando sesión...' : 'Registrando...'}</span>
            </div>
          ) : (
            type === 'login' ? 'Iniciar sesión' : 'Registrarse'
          )}
        </button>
      </form>
    </div>
  );
}