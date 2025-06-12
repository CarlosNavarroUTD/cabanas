'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaUserCircle, FaSignOutAlt, FaEye } from 'react-icons/fa';
import { AuthContext } from '@/services/auth/AuthContext';
import AuthService from '@/services/auth/AuthService';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      AuthService.logout();
      setCurrentUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewSite = () => {
    router.push('/');
  };

  const linkClasses = (path: string) =>
    `${pathname === path || pathname.startsWith(path)
      ? 'bg-accent text-white'
      : 'text-gray-300 hover:bg-primary hover:text-white'
    } px-3 py-2 rounded-md text-sm font-medium`;

  return (
    <nav className="bg-primary-dark py-4">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link href="/" className={linkClasses('/')}>Home</Link>
        <Link href="/cabins" className={linkClasses('/cabins')}>Cabañas</Link>
        <Link href="/packages" className={linkClasses('/packages')}>Paquetes</Link>

        {!isAuthenticated && (
          <>
            <Link href="/login" className={linkClasses('/login')}>Iniciar Sesión</Link>
            <Link href="/register" className={linkClasses('/register')}>Registrarse</Link>
          </>
        )}

        {isAuthenticated && (
          <div className="relative ml-auto">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center text-sm focus:outline-none text-gray-300 hover:text-white"
            >
              <FaUserCircle className="w-6 h-6 mr-2" />
              <span>{currentUser?.nombre || currentUser?.email || 'Usuario'}</span>
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <FaUserCircle className="mr-2" /> Perfil
                </Link>
                <button
                  onClick={handleViewSite}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaEye className="mr-2" /> Ir al dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" /> Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
