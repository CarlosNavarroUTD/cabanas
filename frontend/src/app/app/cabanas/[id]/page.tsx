'use client';

import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import CabanaForm from '@/components/cabanas/cabanadetails/CabanaForm';
import HistorialAcciones from '@/components/cabanas/cabanadetails/HistorialAcciones';
import MonitoreoAmbiental from '@/components/cabanas/cabanadetails/MonitoreoAmbiental';
import { useCabanas } from '@/hooks/useCabanas';

// Interfaces
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

export default function CabanaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cabanaId = params.id as string;
  
  // Usar selectores específicos para evitar re-renders
  const cabana = useCabanas(state => state.currentCabana);
  const loading = useCabanas(state => state.loading);
  const error = useCabanas(state => state.error);
  
  // Obtener funciones específicas con selectores
  const fetchCabanaDetail = useCabanas(state => state.fetchCabanaDetail);
  const updateCabana = useCabanas(state => state.updateCabana);
  const clearError = useCabanas(state => state.clearError);
  const clearCurrentCabana = useCabanas(state => state.clearCurrentCabana);

  useEffect(() => {
    const loadCabanaData = async () => {
      if (!cabanaId || isNaN(parseInt(cabanaId))) {
        return;
      }
      
      // Limpiar cabaña anterior y errores
      clearCurrentCabana();
      clearError();
      
      // Cargar datos de la cabaña
      await fetchCabanaDetail(parseInt(cabanaId));
    };

    loadCabanaData();
  }, [cabanaId]); // Solo cabanaId como dependencia

  const handleFormSubmit = async (data: CabanaFormData) => {
    try {
      if (!cabana) return;
      
      const updatedCabana = await updateCabana(cabana.id, data);
      
      if (updatedCabana) {
        console.log('Cabaña actualizada exitosamente:', updatedCabana);
      }
      
    } catch (error) {
      console.error('Error al actualizar la cabaña:', error);
    }
  };

  const handleFormCancel = () => {
    console.log('Formulario cancelado para cabaña', cabanaId);
    clearError();
  };

  const handleGoBack = () => {
    clearCurrentCabana();
    clearError();
    router.push('/app/cabanas');
  };

  const handleRetry = () => {
    clearError();
    if (cabanaId && !isNaN(parseInt(cabanaId))) {
      fetchCabanaDetail(parseInt(cabanaId));
    }
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando cabaña...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="space-x-4">
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Reintentar
            </button>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Volver a Cabañas
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Cabaña no encontrada
  if (!loading && !cabana) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cabaña no encontrada</h2>
          <p className="text-gray-600 mb-4">La cabaña con ID {cabanaId} no existe.</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a Cabañas
          </button>
        </div>
      </div>
    );
  }

  // Validar que cabanaId sea válido
  if (!cabanaId || isNaN(parseInt(cabanaId))) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ID de cabaña inválido</h2>
          <p className="text-gray-600 mb-4">El ID proporcionado no es válido.</p>
          <button
            onClick={handleGoBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a Cabañas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleGoBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Volver a Cabañas</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">{cabana?.nombre}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              cabana?.estado === 'disponible' ? 'bg-green-100 text-green-800' :
              cabana?.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {cabana?.estado ? cabana.estado.charAt(0).toUpperCase() + cabana.estado.slice(1) : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Layout de 3 columnas */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Columna 1: Formulario */}
        <div className="w-1/3 p-6 overflow-hidden">
          {cabana && (
            <CabanaForm 
              cabana={cabana}
              onSubmit={handleFormSubmit}
              onCancel={handleFormCancel}
            />
          )}
        </div>

        {/* Columna 2: Historial de Acciones */}
        <div className="w-1/3 p-6 border-l border-gray-200">
          <HistorialAcciones cabanaId={parseInt(cabanaId)} />
        </div>

        {/* Columna 3: Monitoreo */}
        <div className="w-1/3 p-6 border-l border-gray-200">
          <MonitoreoAmbiental cabanaId={parseInt(cabanaId)} />
        </div>
      </div>
    </div>
  );
}