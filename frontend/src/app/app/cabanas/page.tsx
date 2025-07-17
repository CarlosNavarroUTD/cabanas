'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useCabanas } from '@/hooks/useCabanas';
import { useTeamContext } from '@/contexts/TeamContext';
import { useCabanasActions } from '@/hooks/useCabanasActions';
import type { CabanaDetail } from '@/types/cabanasTypes';

// Importar componentes
import CabanaLoading from '@/components/cabanas/CabanasLoading';
import CabanaError from '@/components/cabanas/CabanasError';
import CabanaAdminCard from '@/components/cabanas/CabanaAdminCard';
import CabanaForm from '@/components/cabanas/CabanaForm'; // Asegúrate de que la ruta sea correcta

export const CabanasAdminPage = () => {
    const { fetchCabanas } = useCabanasActions();
    const { currentTeam } = useTeamContext();
  const {
    cabanas,
    loading,
    error
  } = useCabanas();

  // Estados para el formulario
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCabanaId, setEditingCabanaId] = useState<number | undefined>(undefined);
  const [cabanaToEdit, setCabanaToEdit] = useState<CabanaDetail | null>(null);

// Reemplaza el useEffect en tu componente CabanasAdminPage:

useEffect(() => {
    if (currentTeam) {
      // Obtener cabañas del equipo seleccionado
      fetchCabanas({ team: currentTeam.id });
    }
  }, [currentTeam]); // Agregada fetchCabanas como dependencia
  
  // O si prefieres una solución más robusta, usa useCallback para memoizar la función:

  

  const handleAddCabana = () => {
    setEditingCabanaId(undefined); // Asegurarse de que no estamos editando
    setIsFormOpen(true);
  };

  const { currentCabana, fetchCabanaDetail } = useCabanas();

  const handleEditCabana = async (cabanaId: number) => {
    await fetchCabanaDetail(cabanaId);
    setEditingCabanaId(cabanaId);
    setIsFormOpen(true);
  };

  
  

  const handleToggleCabana = (cabanaId: number, currentStatus: string) => {
    // Implementar toggle de estado de cabaña
    console.log('Toggle cabaña:', cabanaId, 'estado actual:', currentStatus);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCabanaId(undefined);
  };

  const handleFormSuccess = (cabana: any) => {
    // Refrescar la lista de cabañas después de crear/editar
    if (currentTeam) {
      fetchCabanas({ team: currentTeam.id });
    }
  };

  if (loading) {
    return <CabanaLoading />;
  }

  if (error) {
    return <CabanaError error={error} />;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administrar Cabañas
              </h1>
              {currentTeam && (
                <p className="text-sm text-gray-600 mt-1">
                  Equipo: {currentTeam.name}
                </p>
              )}
            </div>
            <button
              onClick={handleAddCabana}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Cabaña
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            {cabanas.length} cabaña{cabanas.length !== 1 ? 's' : ''} encontrada{cabanas.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Cabañas grid */}
        {cabanas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cabanas.map((cabana) => (
              <CabanaAdminCard
                key={cabana.id}
                cabana={{
                  ...cabana,
                  imagen_principal: cabana.imagen_principal ?? undefined,
                }}
                onEdit={handleEditCabana}
                onToggle={handleToggleCabana}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay cabañas registradas
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza añadiendo tu primera cabaña para este equipo.
              </p>
              <button
                onClick={handleAddCabana}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Añadir Primera Cabaña
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Formulario Modal */}
  

    {isFormOpen && (
        <CabanaForm
        cabana={currentCabana}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
      />
      
      )}


    </div>
  );
};

export default CabanasAdminPage;