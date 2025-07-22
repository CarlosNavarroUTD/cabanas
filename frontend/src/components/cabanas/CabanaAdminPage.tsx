// src/components/CabanaAdminPage.tsx
'use client';

import { useState, useEffect } from 'react';
import { Plus, Search, Filter, AlertCircle } from 'lucide-react';
import CabanaAdminCard from '@/components/cabanas/CabanaAdminCard';
import CabanaForm from '@/components/cabanas/CabanaForm';
import { CabanaList, CabanaFilters } from '@/types/cabanasTypes';
import { useCabanas } from '@/hooks/useCabanas';


interface CabanaAdminPageProps {
  teamId: number;
}

export default function CabanaAdminPage({ teamId }: CabanaAdminPageProps) {
  const [filteredCabanas, setFilteredCabanas] = useState<CabanaList[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedCabana, setSelectedCabana] = useState<CabanaList | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Usar el hook useCabanas
  const { cabanas, isLoading, error, fetchCabanas, setCabanas, setError } = useCabanas();

  const [filters, setFilters] = useState<CabanaFilters>({
    estado: undefined,
    capacidad: undefined,
    permite_mascotas: undefined,
    ordering: '-creada_en'
  });

  // Cargar cabañas del team
  useEffect(() => {
    fetchCabanas({ team: teamId });
  }, [teamId, fetchCabanas]);


  // Filtrar cabañas cuando cambien los filtros o el término de búsqueda
  useEffect(() => {
    filterCabanas();
  }, [cabanas, searchTerm, filters]);

  const filterCabanas = () => {
    let filtered = [...cabanas];

    // Filtro por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(cabana =>
        cabana.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cabana.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por estado
    if (filters.estado) {
      filtered = filtered.filter(cabana => cabana.estado === filters.estado);
    }

    // Filtro por capacidad
    if (filters.capacidad) {
      filtered = filtered.filter(cabana => cabana.capacidad >= filters.capacidad!);
    }

    // Filtro por mascotas
    if (filters.permite_mascotas !== undefined) {
      filtered = filtered.filter(cabana => cabana.permite_mascotas === filters.permite_mascotas);
    }

    // Ordenamiento
    if (filters.ordering) {
      filtered.sort((a, b) => {
        const isDesc = filters.ordering!.startsWith('-');
        const field = filters.ordering!.replace('-', '') as keyof CabanaList;

        let aValue = a[field];
        let bValue = b[field];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }


        if ((aValue ?? '') < (bValue ?? '')) return isDesc ? 1 : -1;
        if ((aValue ?? '') > (bValue ?? '')) return isDesc ? -1 : 1;
        return 0;
      });
    }

    setFilteredCabanas(filtered);
  };

  const handleCreateCabana = () => {
    setSelectedCabana(null);
    setShowForm(true);
  };

  const handleToggleCabana = async (cabanaId: number, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'mantenimiento' ? 'disponible' : 'mantenimiento';

      const response = await fetch(`/api/cabanas/${cabanaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estado: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la cabaña');
      }

      // Actualizar el estado local
      setCabanas(prev => prev.map(cabana =>
        cabana.id === cabanaId
          ? { ...cabana, estado: newStatus as 'disponible' | 'ocupada' | 'mantenimiento' }
          : cabana
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar la cabaña');
    }
  };

  // CabanaAdminPage.tsx
  const handleFormSubmit = () => {
    // Solo manejar el resultado exitoso
    setShowForm(false);
    setSelectedCabana(null);
    // El form ya ejecutó create/update, solo cerramos
  };
  

  const handleFormCancel = () => {
    setShowForm(false);
    setSelectedCabana(null);
  };

  const handleFilterChange = <K extends keyof CabanaFilters>(key: K, value: CabanaFilters[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };


  const clearFilters = () => {
    setFilters({
      estado: undefined,
      capacidad: undefined,
      permite_mascotas: undefined,
      ordering: '-creada_en'
    });
    setSearchTerm('');
  };

  if (showForm) {
    return (
      <CabanaForm
        cabana={selectedCabana}
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administrar Cabañas</h1>
          <p className="text-gray-600 mt-1">
            Gestiona las cabañas de tu equipo ({filteredCabanas.length} de {cabanas.length})
          </p>
        </div>
        <button
          onClick={handleCreateCabana}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cabaña
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar cabañas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado Filter */}
          <select
            value={filters.estado || ''}
            onChange={(e) => {
              const value = e.target.value as CabanaFilters['estado'] | '';
              handleFilterChange('estado', value === '' ? undefined : value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos los estados</option>
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>

          {/* Capacidad Filter */}
          <select
            value={filters.capacidad !== undefined ? filters.capacidad.toString() : ''}
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange('capacidad', value === '' ? undefined : parseInt(value));
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Cualquier capacidad</option>
            <option value="1">1+ personas</option>
            <option value="2">2+ personas</option>
            <option value="4">4+ personas</option>
            <option value="6">6+ personas</option>
            <option value="8">8+ personas</option>
          </select>

          <select
            value={
              filters.permite_mascotas === undefined
                ? ''
                : filters.permite_mascotas
                  ? 'true'
                  : 'false'
            }
            onChange={(e) => {
              const value = e.target.value;
              handleFilterChange(
                'permite_mascotas',
                value === '' ? undefined : value === 'true'
              );
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Mascotas (cualquiera)</option>
            <option value="true">Permite mascotas</option>
            <option value="false">No permite mascotas</option>
          </select>


          <select
            value={filters.ordering || '-creada_en'}
            onChange={(e) => {
              const value = e.target.value as CabanaFilters['ordering'];
              handleFilterChange('ordering', value);
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="-creada_en">Más recientes</option>
            <option value="creada_en">Más antiguas</option>
            <option value="nombre">Nombre (A-Z)</option>
            <option value="-nombre">Nombre (Z-A)</option>
            <option value="costo_por_noche">Precio (menor)</option>
            <option value="-costo_por_noche">Precio (mayor)</option>
            <option value="-calificacion_promedio">Mejor calificadas</option>
            <option value="capacidad">Menor capacidad</option>
            <option value="-capacidad">Mayor capacidad</option>
          </select>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredCabanas.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {cabanas.length === 0 ? (
              <>
                <h3 className="text-lg font-medium mb-2">No hay cabañas registradas</h3>
                <p>Comienza creando tu primera cabaña</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium mb-2">No se encontraron cabañas</h3>
                <p>Intenta ajustar los filtros de búsqueda</p>
              </>
            )}
          </div>
          {cabanas.length === 0 && (
            <button
              onClick={handleCreateCabana}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Crear Primera Cabaña
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCabanas.map((cabana) => (
            <CabanaAdminCard
              key={cabana.id}
              cabana={cabana}
              isFavorite={false} // o algún valor real si lo manejas
              onToggleFavorite={() => console.log('Toggle favorito', cabana.id)}
              onViewDetails={() => console.log('Ver detalles de', cabana.id)}
              //onEdit={handleEditCabana}
              onToggle={handleToggleCabana}
            />
          ))}
        </div>
      )}
    </div>
  );
}