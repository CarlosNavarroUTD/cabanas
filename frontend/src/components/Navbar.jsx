import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaSignOutAlt,
  FaEye 
} from 'react-icons/fa';
import { AuthContext } from '../services/auth/AuthContext';
import AuthService from '../services/auth/AuthService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Use the AuthContext
  const { currentUser, setCurrentUser, isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      // Call the logout method from AuthService
      AuthService.logout();
      
      // Update context state
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleViewSite = () => {
    // Reload current page or navigate to home
    window.location.href = '/';
  };

  return (
    <nav className="bg-primary-dark py-4">
      <div className="ml-10 flex items-baseline space-x-4">
        <Link
          to="/"
          className={`${
            location.pathname === '/'
              ? 'bg-accent text-white'
              : 'text-gray-300 hover:bg-primary hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Home
        </Link>
        <Link
          to="/cabins"
          className={`${
            location.pathname.startsWith('/cabins')
              ? 'bg-accent text-white'
              : 'text-gray-300 hover:bg-primary hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Cabañas
        </Link>
        <Link
          to="/packages"
          className={`${
            location.pathname.startsWith('/packages')  
              ? 'bg-accent text-white'
              : 'text-gray-300 hover:bg-primary hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Paquetes
        </Link>

        {/* Conditionally render login/register links */}
        {!isAuthenticated && (
          <>
            <Link
              to="/login"
              className={`${
                location.pathname === '/login'
                  ? 'bg-accent text-white'
                  : 'text-gray-300 hover:bg-primary hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className={`${
                location.pathname === '/register'
                  ? 'bg-accent text-white'
                  : 'text-gray-300 hover:bg-primary hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Registrarse
            </Link>
          </>
        )}

        {/* User menu for authenticated users */}
        {isAuthenticated && (
          <div className="relative ml-auto">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center text-sm focus:outline-none text-gray-300 hover:text-white"
            >
              <FaUserCircle className="w-6 h-6 mr-2" />
              <span>
                {currentUser?.nombre || currentUser?.email || 'Usuario'}
              </span>
            </button>
            
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaUserCircle className="mr-2" />
                  Perfil
                </Link>
                <button
                  onClick={handleViewSite}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaEye className="mr-2" />
                  Ia al dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FaSignOutAlt className="mr-2" />
                  Cerrar sesión
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