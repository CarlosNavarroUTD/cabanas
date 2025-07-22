'use client';

import { useState, useEffect } from 'react';
import { Edit3 } from 'lucide-react';
import { useCabanas } from '@/hooks/useCabanas';
import { useTeamContext } from '@/contexts/TeamContext';

interface Cabana {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  numero_habitaciones: number;
  numero_banos: number;
  costo_por_noche: number;
  permite_mascotas: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  imagen_principal?: string;
  calificacion_promedio: number;
  total_resenas: number;
  team_name: string;
  hora_checkin?: string;
  hora_checkout?: string;
  servicios: { id: number; nombre: string; descripcion: string; }[];
}

interface CabanaFormData {
  nombre: string;
  descripcion: string;
  capacidad: number;
  numero_habitaciones: number;
  numero_banos: number;
  costo_por_noche: number;
  permite_mascotas: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  imagen_principal: string;
  hora_checkin: string;
  hora_checkout: string;
  servicios: number[];
  team_id: number;
}

interface CabanaFormProps {
  cabana?: Cabana | null;
  onSubmit: (data: CabanaFormData) => void;
  onCancel: () => void;
}

export default function CabanaForm({ cabana, onSubmit, onCancel }: CabanaFormProps) {
  const { 
    servicios, 
    fetchServicios, 
    createCabana, 
    updateCabana, 
    loadingCreate, 
    loadingUpdate, 
    error 
  } = useCabanas();

  // Obtener el equipo actual del contexto
  const { currentTeam } = useTeamContext();

  // Initialize with default values to prevent null/undefined
  const getInitialFormData = (): CabanaFormData => ({
    nombre: cabana?.nombre ?? '',
    descripcion: cabana?.descripcion ?? '',
    capacidad: cabana?.capacidad ?? 1,
    numero_habitaciones: cabana?.numero_habitaciones ?? 1,
    numero_banos: cabana?.numero_banos ?? 1,
    costo_por_noche: cabana?.costo_por_noche ?? 0,
    permite_mascotas: cabana?.permite_mascotas ?? false,
    estado: cabana?.estado ?? 'disponible',
    imagen_principal: cabana?.imagen_principal ?? '',
    hora_checkin: cabana?.hora_checkin ?? '15:00',
    hora_checkout: cabana?.hora_checkout ?? '11:00',
    servicios: cabana?.servicios?.map(s => s.id) ?? [],
    team_id: currentTeam?.id ?? 0
  });

  const [formData, setFormData] = useState<CabanaFormData>(getInitialFormData);

  const isLoading = loadingCreate || loadingUpdate;

  // Cargar servicios disponibles
  useEffect(() => {
    fetchServicios();
  }, [fetchServicios]);

  // Actualizar team_id cuando cambie el equipo actual
  useEffect(() => {
    if (currentTeam?.id) {
      setFormData(prev => ({
        ...prev,
        team_id: currentTeam.id
      }));
    }
  }, [currentTeam?.id]);

  // Cargar datos si es edición - usar callback para evitar valores undefined
  useEffect(() => {
    if (cabana) {
      setFormData(prev => ({
        ...prev,
        nombre: cabana.nombre ?? '',
        descripcion: cabana.descripcion ?? '',
        capacidad: cabana.capacidad ?? 1,
        numero_habitaciones: cabana.numero_habitaciones ?? 1,
        numero_banos: cabana.numero_banos ?? 1,
        costo_por_noche: cabana.costo_por_noche ?? 0,
        permite_mascotas: cabana.permite_mascotas ?? false,
        estado: cabana.estado ?? 'disponible',
        imagen_principal: cabana.imagen_principal ?? '',
        hora_checkin: cabana.hora_checkin ?? '15:00',
        hora_checkout: cabana.hora_checkout ?? '11:00',
        servicios: cabana.servicios?.map(s => s.id) ?? [],
        team_id: currentTeam?.id ?? 0
      }));
    }
  }, [cabana, currentTeam?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      // Ensure we never set undefined/null values
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      // Ensure string values are never null/undefined
      setFormData(prev => ({
        ...prev,
        [name]: value ?? ''
      }));
    }
  };

  const handleServicioToggle = (servicioId: number) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter(id => id !== servicioId)
        : [...prev.servicios, servicioId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que haya un equipo seleccionado
    if (!currentTeam?.id) {
      console.error('No hay equipo seleccionado');
      return;
    }

    try {
      let result;
      if (cabana) {
        result = await updateCabana(cabana.id, formData);
      } else {
        result = await createCabana(formData);
      }
      
      if (result) {
        onSubmit({
          ...result,
          imagen_principal: result.imagen_principal ?? '',
          servicios: result.servicios.map((servicio: { id: number; nombre: string; descripcion: string }) => servicio.id),
          team_id: 0
        });
      }
    } catch (error) {
      console.error('Error al guardar cabaña:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          {cabana ? 'Editar Cabaña' : 'Nueva Cabaña'}
        </h2>
        
        {/* Mostrar información del equipo actual */}
        {currentTeam && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Equipo:</span> {currentTeam.name}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo por Noche ($)
                </label>
                <input
                  type="number"
                  name="costo_por_noche"
                  value={formData.costo_por_noche}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habitaciones
                </label>
                <input
                  type="number"
                  name="numero_habitaciones"
                  value={formData.numero_habitaciones}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baños
                </label>
                <input
                  type="number"
                  name="numero_banos"
                  value={formData.numero_banos}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <input
                  type="time"
                  name="hora_checkin"
                  value={formData.hora_checkin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <input
                  type="time"
                  name="hora_checkout"
                  value={formData.hora_checkout}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Imagen principal (URL)
              </label>
              <input
                type="url"
                name="imagen_principal"
                value={formData.imagen_principal}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="permite_mascotas"
                  checked={formData.permite_mascotas}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Permite mascotas</span>
              </label>
            </div>
          </div>

          {/* Servicios */}
          {servicios.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Servicios Incluidos</h3>
              <div className="space-y-2">
                {servicios.map(servicio => (
                  <label key={servicio.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.servicios.includes(servicio.id)}
                      onChange={() => handleServicioToggle(servicio.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <span className="text-sm font-medium text-gray-700">{servicio.nombre}</span>
                      <p className="text-xs text-gray-500">{servicio.descripcion}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !currentTeam?.id}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {cabana ? 'Actualizando...' : 'Creando...'}
                </span>
              ) : (
                cabana ? 'Actualizar Cabaña' : 'Crear Cabaña'
              )}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}