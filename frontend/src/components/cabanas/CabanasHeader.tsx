import React from 'react';
import { Home, Filter } from 'lucide-react';

interface CabanaHeaderProps {
  showFilters: boolean;
  onToggleFilters: () => void;
}

const CabanaHeader: React.FC<CabanaHeaderProps> = ({ 
  showFilters, 
  onToggleFilters 
}) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Home className="w-8 h-8 text-blue-600 mr-2" />
            <h1 className="text-2xl font-bold text-gray-900">Cabañas</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleFilters}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default CabanaHeader;