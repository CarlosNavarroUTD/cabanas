import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AlertCircle, ChevronRight, ChevronLeft, Check, Loader } from 'lucide-react';
import CabinService from '.././../services/api/CabinService';
import { AuthContext } from '../../services/auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthService from '../../services/auth/AuthService'; // Add this import

const AddCabinForm = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, setCurrentUser } = useContext(AuthContext);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({
    nombre: '',
    descripcion: '',
    capacidad: 1,
    costo_por_noche: ''
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [servicios, setServicios] = useState([]);
  
  const loadServicios = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setIsLoadingServices(true);
    try {
      const data = await CabinService.getServicios();
      if (Array.isArray(data)) {
        setServicios(data);
      } else if (Array.isArray(data?.results)) {
        setServicios(data.results);
      } else {
        console.error('Estructura de datos inesperada:', data);
        setServicios([]);
      }
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setError(error?.response?.data?.detail || error.message);
      setServicios([]);
    } finally {
      setIsLoadingServices(false);
    }
  }, [isAuthenticated]);

  // Estado inicial y verificación de autenticación
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        console.log('Current User on Mount:', currentUser);
        
        if (!isAuthenticated) {
          navigate('/login');
          return;
        }
  
        // Force user fetch if not present
        if (!currentUser) {
          const fetchedUser = await AuthService.getCurrentUser();
          setCurrentUser(fetchedUser);
        }
  
        if (currentUser?.tipo_usuario !== 'arrendador') {
          navigate('/admin/profile');
          return;
        }
        
        await loadServicios();
      } catch (error) {
        console.error('Initialization error:', error);
        navigate('/login');
      }
    };
  
    initializeComponent();
  }, [isAuthenticated, currentUser, navigate, loadServicios]);
  
  const validateBasicInfo = () => {
    return (
      basicInfo.nombre.trim() !== '' &&
      basicInfo.descripcion.trim() !== '' &&
      basicInfo.capacidad > 0 &&
      basicInfo.costo_por_noche > 0
    );
  };

  const nextStep = () => {
    setError(null);
    setStep(step + 1);
  };
  
  const prevStep = () => setStep(step - 1);

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: name === 'capacidad' || name === 'costo_por_noche'
        ? parseFloat(value) || value
        : value
    }));
  };

  const toggleService = (serviceId) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleSubmit = async () => {
    if (!isAuthenticated || !currentUser) {
      setError('Debes iniciar sesión para crear una cabaña');
      return;
    }

    if (!currentUser.arrendador_id) {
      setError('No se encontró la información del arrendador');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const cabinData = {
        arrendador: currentUser.arrendador_id,
        nombre: basicInfo.nombre,
        descripcion: basicInfo.descripcion,
        capacidad: parseInt(basicInfo.capacidad),
        costo_por_noche: parseFloat(basicInfo.costo_por_noche),
        slug: generateSlug(basicInfo.nombre),
        ubicacion: 1
      };

      console.log('Datos de la cabaña a enviar:', cabinData);

      const createdCabin = await CabinService.createCabin(cabinData);
      console.log('Cabaña creada:', createdCabin);
      
      navigate(`/cabins/${createdCabin.slug}`);
    } catch (error) {
      console.error('Error al crear la cabaña:', error);
      const errorDetail = error?.response?.data?.detail || 
                         error?.response?.data || 
                         error.message;
      setError(typeof errorDetail === 'object' ? 
               JSON.stringify(errorDetail) : errorDetail);
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loader mientras se inicializa
  if (isInitializing) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin mr-2" />
          <span>Cargando formulario...</span>
        </div>
      </div>
    );
  }

  // Verificar autenticación
  if (!isAuthenticated) {
    return null; // No mostramos nada ya que useEffect redirigirá
  }

  const renderServiciosStep = () => {
    if (isLoadingServices) {
      return (
        <div className="flex justify-center items-center py-8">
          <Loader className="animate-spin mr-2" />
          <span>Cargando servicios...</span>
        </div>
      );
    }

    if (!Array.isArray(servicios) || servicios.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No hay servicios disponibles
        </div>
      );
    }

    return (
      <div className="grid grid-cols-3 gap-4">
        {servicios.map(servicio => (
          <div
            key={servicio.id}
            onClick={() => toggleService(servicio.id)}
            className={`p-3 border rounded cursor-pointer transition-all ${
              selectedServices.includes(servicio.id)
                ? 'bg-blue-500 text-white'
                : 'hover:bg-gray-100'
            }`}
          >
            {servicio.nombre}
          </div>
        ))}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">Información Básica de la Cabaña</h2>
            <div>
              <label className="block mb-2">Nombre de la Cabaña *</label>
              <input
                type="text"
                name="nombre"
                value={basicInfo.nombre}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border rounded"
                placeholder="Ej: Cabaña del Bosque"
              />
            </div>
            <div>
              <label className="block mb-2">Descripción *</label>
              <textarea
                name="descripcion"
                value={basicInfo.descripcion}
                onChange={handleBasicInfoChange}
                className="w-full p-2 border rounded"
                rows={4}
                placeholder="Describe los detalles y características de tu cabaña"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Capacidad *</label>
                <input
                  type="number"
                  name="capacidad"
                  value={basicInfo.capacidad}
                  onChange={handleBasicInfoChange}
                  className="w-full p-2 border rounded"
                  min={1}
                />
              </div>
              <div>
                <label className="block mb-2">Costo por Noche *</label>
                <input
                  type="number"
                  name="costo_por_noche"
                  value={basicInfo.costo_por_noche}
                  onChange={handleBasicInfoChange}
                  className="w-full p-2 border rounded"
                  min={0}
                  step={0.01}
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Selecciona Servicios</h2>
            {renderServiciosStep()}
          </div>
        );

      case 3:
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Sube Imágenes de tu Cabaña</h2>
            <div className="border-dashed border-2 p-4 text-center">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="cursor-pointer text-blue-500 hover:underline"
              >
                Seleccionar Imágenes
              </label>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Imagen ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <AlertCircle className="inline mr-2" />
          {error}
        </div>
      )}
      {renderStep()}

      <div className="flex justify-between mt-6">
        {step > 1 && (
          <button
            onClick={prevStep}
            className="flex items-center bg-gray-200 px-4 py-2 rounded"
            disabled={isLoading || isLoadingServices}
          >
            <ChevronLeft className="mr-2" /> Anterior
          </button>
        )}

        {step < 3 ? (
          <button
            onClick={nextStep}
            disabled={
              (step === 1 && !validateBasicInfo()) ||
              isLoading ||
              (step === 2 && isLoadingServices)
            }
            className={`flex items-center px-4 py-2 rounded ${
              (step === 1 && !validateBasicInfo()) || isLoading || isLoadingServices
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-primary-dark text-white hover:bg-primary'
            }`}
          >
            Siguiente <ChevronRight className="ml-2" />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex items-center px-4 py-2 rounded ${
              isLoading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isLoading ? (
              <>
                <Loader className="animate-spin mr-2" /> Creando...
              </>
            ) : (
              <>
                <Check className="mr-2" /> Crear Cabaña
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddCabinForm;