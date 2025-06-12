import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../../services/auth/AuthContext';
import AuthService from '../../../services/auth/AuthService';

const RegisterScreen = () => {
  const [formData, setFormData] = useState({
    email: '',
    nombre_usuario: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { setIsAuthenticated, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear any previous errors when user starts typing
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset error and set loading
    setError('');
    setIsLoading(true);

    // Validation checks
    if (!formData.email) {
      setError('Por favor ingresa un correo electrónico');
      setIsLoading(false);
      return;
    }

    if (!formData.nombre_usuario) {
      setError('Por favor ingresa un nombre de usuario');
      setIsLoading(false);
      return;
    }

    if (!formData.password) {
      setError('Por favor ingresa una contraseña');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      setIsLoading(false);
      return;
    }

    try {
      // Prepare registration payload
      const registrationPayload = {
        email: formData.email,
        nombre_usuario: formData.nombre_usuario,
        password: formData.password
      };

      const response = await AuthService.register(registrationPayload);
      
      // Check for successful registration
      if (response.access && response.refresh) {
        setIsAuthenticated(true);
        setCurrentUser(response.user);

        // Navigate based on user type
        if (response.user.tipo_usuario === 'admin' || response.user.tipo_usuario === 'arrendador') {
          navigate('/admin');
        } else if (response.user.tipo_usuario === 'cliente') {
          navigate('/');
        }
      } else {
        // If response doesn't contain expected tokens
        setError('Registro fallido. Por favor intenta de nuevo.');
      }
    } catch (error) {
      // Handle different types of errors
      if (error.response) {
        // Server responded with an error
        setError(error.response.data.detail || 'Error en el registro');
      } else if (error.request) {
        // Request was made but no response received
        setError('No se pudo conectar con el servidor. Verifica tu conexión.');
      } else {
        // Something happened in setting up the request
        setError('Error inesperado. Por favor intenta de nuevo.');
      }
      console.error('Error de registro:', error);
    } finally {
      // Always set loading to false
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-primary-dark mb-6 text-center">Regístrate</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary-dark">
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray border border-black-300 rounded-md text-sm shadow-sm placeholder-blue-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label htmlFor="nombre_usuario" className="block text-sm font-medium text-primary-dark">
              Nombre de Usuario
            </label>
            <input
              id="nombre_usuario"
              name="nombre_usuario"
              type="text"
              value={formData.nombre_usuario}
              onChange={handleChange}
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
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray border border-black-300 rounded-md text-sm shadow-sm placeholder-blue-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-primary-dark">
              Confirmar Contraseña
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-gray border border-black-300 rounded-md text-sm shadow-sm placeholder-blue-400
                         focus:outline-none focus:border-primary-dark focus:ring-1 focus:ring-primary-dark"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary-dark hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark'}`}
            >
              {isLoading ? 'Registrando...' : 'Regístrate'}
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