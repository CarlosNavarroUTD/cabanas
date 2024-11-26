import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../services/auth/AuthContext';
import AuthService from '../../../services/auth/AuthService';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      // Handle password mismatch error
      return;
    }
    try {
      const { access, refresh } = await AuthService.register(username, password);
      setIsAuthenticated(true);
      setCurrentUser({ username }); // Assuming the API returns the username
      navigate('/admin');
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error, e.g., display an error message
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-dark mb-6 text-center">Regístrate</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-primary-dark">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray border border-black-300 rounded-md text-sm shadow-sm placeholder-blue-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary-dark">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray border border-black-300 rounded-md text-sm shadow-sm placeholder-blue-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-dark">
              Confirmar contraseña
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray border border-black-300 rounded-md text-sm shadow-sm placeholder-blue-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Regístrate
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-primary-dark">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" className="font-medium text-primary-dark hover:text-primary">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterScreen;