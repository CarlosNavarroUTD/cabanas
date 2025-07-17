'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { User as UserIcon, LogOut, Users, Settings } from 'lucide-react';

export default function AdminNavbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Cerrar menú al hacer clic afuera
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-6 py-3">
      <div className="flex justify-between items-center">
        {/* Logo pequeño */}
        <div className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="logo" 
            width={40} 
            height={20}
            className="object-contain"
          />
          <span className="ml-2 text-gray-600 text-sm font-medium">Admin Dashboard</span>
        </div>

        {/* Perfil y configuración */}
        <div className="flex items-center gap-4">
          {/* Notificaciones o configuración */}
          <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>

          {/* Perfil del usuario */}
          {isAuthenticated && (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {user?.avatar ? (
                  <div className="h-8 w-8 relative">
                    <Image 
                      src={user.avatar} 
                      alt="User avatar" 
                      fill 
                      className="rounded-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700 hidden md:block">
                  {user?.nombre_usuario || 'Usuario'}
                </span>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm text-gray-500">Conectado como</p>
                    <p className="text-sm font-medium text-gray-900">{user?.nombre_usuario}</p>
                  </div>
                  
                  <button 
                    onClick={() => {/* Navegar a dashboard */}}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Dashboard
                  </button>
                  
                  <button 
                    onClick={() => {/* Navegar a perfil */}}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </button>
                  
                  <button 
                    onClick={() => {/* Navegar a equipos */}}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Equipos
                  </button>
                  
                  <hr className="my-2" />
                  
                  <button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}