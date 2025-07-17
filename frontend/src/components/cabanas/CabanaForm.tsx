import React, { useState, useEffect } from 'react';
import { useCabanas } from '@/hooks/useCabanas';
import { CabanaCreateUpdate, CabanaDetail } from '@/types/cabanasTypes';
import { Save, X, Clock, Users, Home, Bath, DollarSign, MapPin, PawPrint, AlertCircle } from 'lucide-react';

interface CabanaFormProps {
  cabana?: CabanaDetail | null;
  onClose: () => void;
  onSuccess?: (cabana: CabanaDetail) => void;
}

export default function CabanaForm({ cabana, onClose, onSuccess }: CabanaFormProps) {
  const {
    servicios,
    loadingCreate,
    loadingUpdate,
    error,
    fetchServicios,
    createCabana,
    updateCabana,
    clearError
  } = useCabanas();

  const [formData, setFormData] = useState<CabanaCreateUpdate>({
    nombre: '',
    descripcion: '',
    capacidad: 1,
    costo_por_noche: 0,
    estado: 'disponible',
    servicios: [],
    superficie: 0,
    numero_habitaciones: 1,
    numero_banos: 1,
    permite_mascotas: false,
    reglas_casa: '',
    hora_checkin: '15:00',
    hora_checkout: '11:00'
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const isEditing = !!cabana;
  const isLoading = loadingCreate || loadingUpdate;

  // Reemplaza tu useEffect actual por este:
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const loadData = async () => {
      try {
        if (servicios.length === 0) {
          await fetchServicios();
        }
        if (cabana && !currentCabana) {
          await fetchCabanaDetail(cabana.id);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error loading data:", error);
        }
      }
    };
  
    if (isMounted) {
      loadData();
      clearError();
    }
  
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [fetchServicios, clearError, servicios.length, cabana, currentCabana, fetchCabanaDetail]);
  

  useEffect(() => {
    if (cabana) {
      setFormData({
        nombre: cabana.nombre,
        descripcion: cabana.descripcion,
        capacidad: cabana.capacidad,
        costo_por_noche: cabana.costo_por_noche,
        estado: cabana.estado,
        servicios: cabana.servicios.map((s: { id: any; }) => s.id),
        superficie: cabana.superficie || 0,
        numero_habitaciones: cabana.numero_habitaciones,
        numero_banos: cabana.numero_banos,
        permite_mascotas: cabana.permite_mascotas,
        reglas_casa: cabana.reglas_casa || '',
        hora_checkin: cabana.hora_checkin,
        hora_checkout: cabana.hora_checkout
      });
    }
  }, [cabana]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.descripcion.trim()) {
      errors.descripcion = 'La descripción es obligatoria';
    }

    if (formData.capacidad < 1) {
      errors.capacidad = 'La capacidad debe ser mayor a 0';
    }

    if (formData.costo_por_noche <= 0) {
      errors.costo_por_noche = 'El costo por noche debe ser mayor a 0';
    }

    if (formData.numero_habitaciones < 1) {
      errors.numero_habitaciones = 'Debe tener al menos 1 habitación';
    }

    if (formData.numero_banos < 1) {
      errors.numero_banos = 'Debe tener al menos 1 baño';
    }

    if (!formData.hora_checkin) {
      errors.hora_checkin = 'La hora de check-in es obligatoria';
    }

    if (!formData.hora_checkout) {
      errors.hora_checkout = 'La hora de check-out es obligatoria';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof CabanaCreateUpdate, value: any) => {
    setFormData((prev: CabanaCreateUpdate) => ({
      ...prev,
      [field]: value
    }));
  };
  


  const handleServicioToggle = (servicioId: number) => {
    const currentServicios = formData.servicios || [];
    const newServicios = currentServicios.includes(servicioId)
      ? currentServicios.filter((id: number) => id !== servicioId)
      : [...currentServicios, servicioId];
    
    handleInputChange('servicios', newServicios);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      let result;
      
      if (isEditing) {
        result = await updateCabana(cabana!.id, formData);
      } else {
        result = await createCabana(formData);
      }

      if (result) {
        onSuccess?.(result); 
        onClose();
      }
      
    } catch (error) {
      console.error('Error al guardar cabaña:', error);
    }
  };

  const handleClose = () => {
    clearError();
    onClose();
  };

  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Cabaña' : 'Nueva Cabaña'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Error general */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
              <AlertCircle className="text-red-500" size={20} />
              <span className="text-red-700">{error}</span>
            </div>
          )}

          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de la Cabaña *
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.nombre ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ej: Cabaña del Bosque"
                />
                {validationErrors.nombre && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.nombre}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => handleInputChange('estado', e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupada">Ocupada</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  validationErrors.descripcion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Describe tu cabaña..."
              />
              {validationErrors.descripcion && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.descripcion}</p>
              )}
            </div>
          </div>

          {/* Capacidad y características */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Capacidad y Características</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Users className="inline mr-1" size={16} />
                  Capacidad *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.capacidad}
                  onChange={(e) => handleInputChange('capacidad', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.capacidad ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.capacidad && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.capacidad}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Home className="inline mr-1" size={16} />
                  Habitaciones *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numero_habitaciones}
                  onChange={(e) => handleInputChange('numero_habitaciones', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.numero_habitaciones ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.numero_habitaciones && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.numero_habitaciones}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Bath className="inline mr-1" size={16} />
                  Baños *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.numero_banos}
                  onChange={(e) => handleInputChange('numero_banos', parseInt(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.numero_banos ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.numero_banos && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.numero_banos}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <MapPin className="inline mr-1" size={16} />
                  Superficie (m²)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.superficie}
                  onChange={(e) => handleInputChange('superficie', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline mr-1" size={16} />
                  Costo por Noche *
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.costo_por_noche}
                  onChange={(e) => handleInputChange('costo_por_noche', parseFloat(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.costo_por_noche ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.costo_por_noche && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.costo_por_noche}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="permite_mascotas"
                  checked={formData.permite_mascotas}
                  onChange={(e) => handleInputChange('permite_mascotas', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="permite_mascotas" className="text-sm font-medium text-gray-700">
                  <PawPrint className="inline mr-1" size={16} />
                  Permite mascotas
                </label>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Horarios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline mr-1" size={16} />
                  Hora de Check-in *
                </label>
                <input
                  type="time"
                  value={formData.hora_checkin}
                  onChange={(e) => handleInputChange('hora_checkin', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.hora_checkin ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.hora_checkin && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.hora_checkin}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Clock className="inline mr-1" size={16} />
                  Hora de Check-out *
                </label>
                <input
                  type="time"
                  value={formData.hora_checkout}
                  onChange={(e) => handleInputChange('hora_checkout', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    validationErrors.hora_checkout ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {validationErrors.hora_checkout && (
                  <p className="text-red-500 text-sm mt-1">{validationErrors.hora_checkout}</p>
                )}
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Servicios</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {servicios.map((servicio) => (
                <div key={servicio.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`servicio-${servicio.id}`}
                    checked={formData.servicios?.includes(servicio.id) || false}
                    onChange={() => handleServicioToggle(servicio.id)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`servicio-${servicio.id}`} className="text-sm font-medium text-gray-700">
                    {servicio.icono && <span className="mr-1">{servicio.icono}</span>}
                    {servicio.nombre}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Reglas de casa */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Reglas de Casa</h3>
            
            <div>
              <textarea
                value={formData.reglas_casa}
                onChange={(e) => handleInputChange('reglas_casa', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Reglas y políticas de la cabaña..."
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  {isEditing ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isEditing ? 'Actualizar Cabaña' : 'Crear Cabaña'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}