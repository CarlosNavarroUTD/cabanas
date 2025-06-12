// /services/auth/AuthContext.tsx

import { createContext, useState, useEffect, ReactNode } from 'react';
import AuthService from '@/services/auth/AuthService';

type User = {
  email: string;
  nombre?: string;
  role?: string;
};

interface AuthContextProps {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  setCurrentUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {}
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
