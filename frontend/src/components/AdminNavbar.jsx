import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaUserCircle, 
  FaSignOutAlt,
  FaEye 
} from 'react-icons/fa';
import { AuthContext } from '../services/auth/AuthContext';
import AuthService from '../services/auth/AuthService';

const AdminNavbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Use the AuthContext
  const { currentUser, setCurrentUser, setIsAuthenticated } = useContext(AuthContext);

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
    // Navigate to the main site or home page
    window.open('/', '_blank');
  };

  return (
    <header className="bg-primary-dark py-4 px-6 text-white flex justify-end items-center fixed top-0 left-16 right-0 z-40">
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          className="flex items-center text-sm focus:outline-none"
        >
          <FaUserCircle className="w-6 h-6 mr-2" />
          <span>
            {currentUser?.nombre || currentUser?.email || 'Administrador'}
          </span>
        </button>
        
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <Link
              to="/admin/profile"
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
              Ver sitio
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
    </header>
  );
};

export default AdminNavbar;