import React from 'react';
import { Search } from 'lucide-react';

interface CabanaSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: (e: React.KeyboardEvent | React.FormEvent) => void;
}

const CabanaSearch: React.FC<CabanaSearchProps> = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch 
}) => {
  return (
    <div className="mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearch(e);
            }
          }}
          placeholder="Buscar cabañas por nombre o descripción..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
};

export default CabanaSearch;