import React from 'react';
import { CabanaFilters as CabanaFiltersType } from '@/types/cabanasTypes';

interface CabanaFiltersProps {
  filters: CabanaFiltersType;
  onFilterChange: (newFilters: Partial<CabanaFiltersType>) => void;
  onClearFilters: () => void;
}

const CabanasFilters: React.FC<CabanaFiltersProps> = ({ 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Capacidad mínima
          </label>
          <input
            type="number"
            min="1"
            value={filters.capacidad || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              capacidad: e.target.value ? Number(e.target.value) : undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estado
          </label>
          <select
            value={filters.estado || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              estado: e.target.value as 'disponible' | 'ocupada' | 'mantenimiento' || undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos</option>
            <option value="disponible">Disponible</option>
            <option value="ocupada">Ocupada</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ordenar por
          </label>
          <select
            value={filters.ordering || ''}
            onChange={(e) => onFilterChange({ 
              ...filters, 
              ordering: e.target.value as 'costo_por_noche' | '-costo_por_noche' | 'capacidad' | '-capacidad' | 'creada_en' | '-creada_en' | 'calificacion_promedio' | '-calificacion_promedio' || undefined 
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Más recientes</option>
            <option value="costo_por_noche">Precio: menor a mayor</option>
            <option value="-costo_por_noche">Precio: mayor a menor</option>
            <option value="capacidad">Capacidad: menor a mayor</option>
            <option value="-capacidad">Capacidad: mayor a menor</option>
            <option value="-calificacion_promedio">Mejor calificados</option>
          </select>
        </div>
        <div className="flex items-center">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={filters.permite_mascotas || false}
              onChange={(e) => onFilterChange({ 
                ...filters, 
                permite_mascotas: e.target.checked 
              })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">
              Pet-friendly
            </span>
          </label>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
        >
          Limpiar filtros
        </button>
      </div>
    </div>
  );
};

export default CabanasFilters;