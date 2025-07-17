import React from 'react';
import { Home } from 'lucide-react';

interface CabanaEmptyStateProps {
  onClearFilters: () => void;
}

const CabanaEmptyState: React.FC<CabanaEmptyStateProps> = ({ onClearFilters }) => {
  return (
    <div className="text-center py-12">
      <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        No se encontraron cabañas
      </h3>
      <p className="text-gray-500 mb-4">
        Intenta ajustar tus filtros de búsqueda
      </p>
      <button
        onClick={onClearFilters}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Limpiar filtros
      </button>
    </div>
  );
};

export default CabanaEmptyState;