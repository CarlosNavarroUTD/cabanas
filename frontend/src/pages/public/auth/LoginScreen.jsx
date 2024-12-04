import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../services/auth/AuthContext';
import AuthService from '../../../services/auth/AuthService';
import TokenService from '../../../services/auth/tokenService';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();



  useEffect(() => {
    const isAuthenticated = TokenService.getAccessToken();
    if (isAuthenticated) {
      const userType = TokenService.getUserType();
      
      // Redirigir según el tipo de usuario
      switch(userType) {
        case 'admin':
        case 'arrendador':
          navigate('/admin', { replace: true });
          break;
        case 'cliente':
          navigate('/', { replace: true });
          break;
        default:
          navigate('/login');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AuthService.login(email, password);
      const userData = await AuthService.getCurrentUser();

      setCurrentUser(userData);
      setIsAuthenticated(true);

      // Redirigir según el tipo de usuario
      if (userData.tipo_usuario === 'admin' || userData.tipo_usuario === 'arrendador') {
        navigate('/admin', { replace: true });
      } else if (userData.tipo_usuario === 'cliente') {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-dark mb-6 text-center">Entra a tu cuenta</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm shadow-sm placeholder-gray-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-white-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-dark hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark"
            >
              Iniciar sesión
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-primary-dark">
          ¿Aún no tienes una cuenta?{' '}
          <Link to="/register" className="font-medium text-primary-dark hover:text-primary">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;