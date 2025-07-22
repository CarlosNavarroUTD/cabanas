'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { Menu, User as UserIcon, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const profileRef = useRef<HTMLDivElement>(null);
  const role = user?.rol; // Por ejemplo: 'cliente' o 'arrendador'

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };

  // Función para obtener estilos del menú móvil
  const getMenuStyles = (menuOpened: boolean) => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      return { right: !menuOpened ? '-100%' : '2rem' };
    }
    return {};
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
    <nav className="bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] text-[#F5F5DC] relative z-50 py-2 shadow-[0px_4px_12px_rgba(0,0,0,0.3)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </Link>

        {/* Menú principal */}
        <div
          className="hidden md:flex items-center gap-8 font-medium md:relative md:top-0 md:right-0 md:bg-transparent md:text-[#F5F5DC] md:flex-row md:p-0 md:rounded-none md:shadow-none
                     absolute top-[4.5rem] right-8 bg-[#F5F5DC] text-[#2E3B1F] flex-col gap-6 p-8 rounded-xl shadow-lg transition-all duration-300 ease-in-out min-w-[200px] z-40"
          style={getMenuStyles(isMenuOpen)}
        >
          <Link href="/" className="text-inherit hover:text-[#cfe0b0] transition-colors duration-300">
            Inicio
          </Link>

          <Link href="/cabanas" className="text-inherit hover:text-[#cfe0b0] transition-colors duration-300">
            Cabañas
          </Link>

          <Link href="/nosotros" className="text-inherit hover:text-[#cfe0b0] transition-colors duration-300">
            Nosotros
          </Link>

          <Link href="/contact" className="text-inherit hover:text-[#cfe0b0] transition-colors duration-300">
            Contacto
          </Link>

          {/* Autenticación */}
          {isAuthenticated ? (
            <>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="focus:outline-none focus:ring-2 focus:ring-[#F5F5DC] rounded-full p-0.5 transition-all duration-300"
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
                    <div className="h-8 w-8 rounded-full bg-[#4E3620] flex items-center justify-center">
                      <UserIcon className="h-5 w-5 text-[#F5F5DC]" />
                    </div>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                    {role === 'cliente' ? (
                      <>
                        <Link
                          href="/mis-reservas"
                          className="block px-4 py-2 text-[#2E3B1F] hover:bg-gray-100 transition-colors duration-200"
                        >
                          Mis Reservas
                        </Link>
                        <Link
                          href="/perfil"
                          className="block px-4 py-2 text-[#2E3B1F] hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Perfil
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/app"
                          className="block px-4 py-2 text-[#2E3B1F] hover:bg-gray-100 transition-colors duration-200"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/app/perfil"
                          className="block px-4 py-2 text-[#2E3B1F] hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Perfil
                        </Link>
                      </>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-[#2E3B1F] hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex md:flex-row flex-col md:items-center gap-4 md:gap-4 w-full md:w-auto">
              <Link href="/login" className="text-inherit hover:text-[#cfe0b0] transition-colors duration-300">
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="bg-[#4E3620] text-[#F5F5DC] px-5 py-2 rounded-lg font-semibold hover:bg-[#8B5E3C] transition-colors duration-300 text-center"
              >
                Registrarse
              </Link>
            </div>
          )}

          {/* Perfil en móvil (cuando está autenticado) */}
          {isAuthenticated && (
            <div className="md:hidden w-full border-t border-[#2E3B1F] pt-4 mt-4">
              {role === 'cliente' ? (
                <>
                  <Link
                    href="/perfil"
                    className="block py-2 text-[#2E3B1F] hover:bg-[rgba(46,59,31,0.1)] transition-colors duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    Perfil
                  </Link>
                  <Link
                    href="/mis-reservas"
                    className="block py-2 text-[#2E3B1F] hover:bg-[rgba(46,59,31,0.1)] transition-colors duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    Mis Reservas
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/app/perfil"
                    className="block py-2 text-[#2E3B1F] hover:bg-[rgba(46,59,31,0.1)] transition-colors duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    Perfil
                  </Link>
                  <Link
                    href="/app"
                    className="block py-2 text-[#2E3B1F] hover:bg-[rgba(46,59,31,0.1)] transition-colors duration-200"
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsProfileOpen(false);
                    }}
                  >
                    Dashboard
                  </Link>
                </>
              )}
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left py-2 text-[#2E3B1F] hover:bg-[rgba(46,59,31,0.1)] transition-colors duration-200 flex items-center"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </button>
            </div>
          )}

        </div>

        {/* Menú hamburguesa */}
        <div
          className="md:hidden text-[#F5F5DC] cursor-pointer p-2 hover:bg-[rgba(245,245,220,0.1)] rounded-md transition-colors duration-200"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu size={30} />
        </div>
      </div>
    </nav>
  );
}