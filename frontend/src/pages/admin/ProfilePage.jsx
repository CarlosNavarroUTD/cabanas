import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircle,
  Save,
  Edit,
  User,
  Check,
  Loader
} from 'lucide-react';
import { AuthContext } from '../../services/auth/AuthContext';
import axios from '../../services/api/config';
import TokenService from '../../services/auth/tokenService';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, isAuthenticated } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombre_usuario: '',
    email: '',
    nombre: '',
    apellido: '',
    dni: '',
    password: '',
    confirmPassword: '',
    nombre_arrendador: currentUser.tipo_usuario === 'arrendador' ?
      (currentUser.arrendador_info?.nombre || '') : '',
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (currentUser) {
      setFormData({
        nombre_usuario: currentUser.nombre_usuario || '',
        email: currentUser.email || '',
        nombre: currentUser.persona_info?.nombre || '',
        apellido: currentUser.persona_info?.apellido || '',
        dni: currentUser.persona_info?.dni || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [currentUser, isAuthenticated, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }

    if (!formData.nombre || !formData.apellido || !formData.dni) {
      setError('Todos los campos son obligatorios');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const token = TokenService.getAccessToken();
      console.log('Current User:', currentUser);
      console.log('Access Token:', token);

      // Preparar datos de actualización base
      const updateData = {
        usuario: {
          nombre_usuario: formData.nombre_usuario,
          email: formData.email,
          ...(formData.password && { password: formData.password })
        },
        persona: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          dni: formData.dni
        }
      };

      // Agregar datos de arrendador si el usuario es arrendador
      if (currentUser.tipo_usuario === 'arrendador') {
        updateData.arrendador = {
          nombre: formData.nombre_arrendador || formData.nombre
        };
      }

      console.log('Update Data:', updateData);

      const response = await axios.patch(
        `/api/usuarios/${currentUser.id_usuario}/update_profile/`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update Response:', response.data);

      // Actualizar el usuario actual con los datos de respuesta
      const updatedUserData = {
        ...currentUser,
        ...response.data,
        persona_info: response.data.persona_info || currentUser.persona_info,
        arrendador_info: response.data.arrendador_info || currentUser.arrendador_info
      };

      setCurrentUser(updatedUserData);
      setSuccessMessage('Perfil actualizado exitosamente');
      setIsEditing(false);

      // Restablecer los campos de contraseña
      setFormData(prev => ({
        ...prev,
        password: '',
        confirmPassword: ''
      }));

    } catch (error) {
      console.error('Update Error:', error.response || error);

      // Manejo detallado de errores
      let errorMessage = 'Error al actualizar el perfil';

      if (error.response) {
        // Errores de validación del backend
        if (error.response.data.usuario) {
          errorMessage = Object.values(error.response.data.usuario)[0];
        } else if (error.response.data.persona) {
          errorMessage = Object.values(error.response.data.persona)[0];
        } else if (error.response.data.arrendador) {
          errorMessage = Object.values(error.response.data.arrendador)[0];
        } else if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <User className="mr-3" /> Mi Perfil
        </h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-primary-dark text-white px-4 py-2 rounded flex items-center hover:bg-primary"
          >
            <Edit className="mr-2" /> Editar
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <AlertCircle className="inline mr-2" />
          {error}
        </div>
      )}

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <Check className="inline mr-2" />
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Nombre de Usuario</label>
            <input
              type="text"
              name="nombre_usuario"
              value={formData.nombre_usuario}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div>
            <label className="block mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>
          <div>
            <label className="block mb-2">Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">DNI</label>
            <input
              type="text"
              name="dni"
              value={formData.dni}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">Nueva Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Dejar en blanco si no desea cambiar"
              />
            </div>
            <div>
              <label className="block mb-2">Confirmar Contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Confirme la nueva contraseña"
              />
            </div>
          </div>
        )}

        {isEditing && (
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setError(null);
                setSuccessMessage(null);
              }}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center px-4 py-2 rounded ${isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
                }`}
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin mr-2" /> Guardando...
                </>
              ) : (
                <>
                  <Save className="mr-2" /> Guardar Cambios
                </>
              )}
            </button>
          </div>
        )}
      </form>

      {currentUser.tipo_usuario === 'arrendador' && (
  <div>
    <label className="block mb-2">ID de Arrendador</label>
    <input
      type="text"
      name="id_arrendador"
      value={currentUser.arrendador_info?.id_arrendador || ''}
      disabled
      className="w-full p-2 border rounded bg-gray-100 text-gray-500"
      readOnly
    />
          <label className="block mt-4 mb-2">Nombre de Arrendador</label>
          <input
            type="text"
            name="nombre_arrendador"
            value={formData.nombre_arrendador}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full p-2 border rounded ${!isEditing ? 'bg-gray-100' : ''}`}
          />
        </div>
      )}

    </div>
  );
};

export default ProfilePage;