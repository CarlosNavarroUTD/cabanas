//src/app/(public)/cabanas/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Importar useRouter para Next.js
import { useCabanas } from '@/hooks/useCabanas';
import { CabanaFilters } from '@/types/cabanasTypes';

// Importar componentes desde @/components/cabanas/
import CabanaHeader from '@/components/cabanas/CabanasHeader';
import CabanaSearch from '@/components/cabanas/CabanasSearch';
import CabanasFilters from '@/components/cabanas/CabanasFilter';
import CabanaResultsCount from '@/components/cabanas/CabanaResultsCountProps';
import CabanaGrid from '@/components/cabanas/CabanasGrid';
import CabanaEmptyState from '@/components/cabanas/CabanasEmptyState';
import CabanaLoading from '@/components/cabanas/CabanasLoading';
import CabanaError from '@/components/cabanas/CabanasError';

const CabanasPage = () => {
  const router = useRouter(); // Hook para navegación en Next.js
  
  const {
    cabanas,
    loading,
    error,
    fetchCabanas,
    filters,
    setFilters,
    clearFilters
  } = useCabanas();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    fetchCabanas();
  }, []);

  const handleSearch = (e: React.KeyboardEvent | React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchTerm });
    fetchCabanas({ ...filters, search: searchTerm });
  };

  const handleFilterChange = (newFilters: Partial<CabanaFilters>) => {
    setFilters(newFilters);
    fetchCabanas(newFilters);
  };

  const toggleFavorite = (cabanaId: number) => {
    setFavorites(prev => 
      prev.includes(cabanaId) 
        ? prev.filter(id => id !== cabanaId)
        : [...prev, cabanaId]
    );
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchTerm('');
    fetchCabanas();
  };

  const handleViewDetails = (cabanaId: number) => {
    // Navegar a la página de detalles de la cabaña
    router.push(`/cabanas/${cabanaId}`);
  };

  if (loading && cabanas.length === 0) {
    return <CabanaLoading />;
  }

  if (error) {
    return <CabanaError error={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <CabanaHeader 
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CabanaSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
        />

        {showFilters && (
          <CabanasFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        )}

        <CabanaResultsCount count={cabanas.length} />

        {cabanas.length > 0 ? (
          <CabanaGrid
            cabanas={cabanas.map(cabana => ({
              ...cabana,
              imagen_principal: cabana.imagen_principal ?? undefined,
            }))}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onViewDetails={handleViewDetails}
          />
        ) : (
          !loading && (
            <CabanaEmptyState onClearFilters={handleClearFilters} />
          )
        )}
      </div>
    </div>
  );
};

export default CabanasPage;