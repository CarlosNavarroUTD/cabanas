import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "../../components/card";
import { RefreshCw } from 'lucide-react';
import CabinService from '../../services/api/CabinService';

const PineTreeIcon = () => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    fill="currentColor"
    className="text-green-500"
  >
    <path d="M12,2L4,12H7L4,18H10V22H14V18H20L17,12H20L12,2Z" />
  </svg>
);

export default function CabinCards() {
  const [cabins, setCabins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCabins = async () => {
      try {
        setIsLoading(true);
        const response = await CabinService.getCabins();
        setCabins(response.results || []);
      } catch (err) {
        console.error('Error fetching cabins:', err);
        setError('No se pudieron cargar las cabañas. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCabins();
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-2">Cargando cabañas...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Empty state
  if (cabins.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        No hay cabañas disponibles
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cabins.map((cabin) => (
          <CabinCard key={cabin.id} cabin={cabin} />
        ))}
      </div>
    </div>
  );
}

function CabinCard({ cabin }) {
  // Calculate rating based on some property of the cabin (you might want to adjust this)
  const rating = 5; // For now hardcoded to 5, you could base this on reviews or other metrics

  return (
    <Card className="overflow-hidden border-0 bg-white shadow-lg rounded-2xl">
      <CardContent className="p-0">
        <div className="relative">
          <img
            alt={cabin.nombre}
            className="h-[200px] w-full object-cover"
            src={cabin.imagen_principal || "/api/placeholder/400/300"}
          />
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-900">{cabin.nombre}</h3>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: rating }).map((_, i) => (
                  <PineTreeIcon key={i} />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                {cabin.ubicacion_nombre}
              </span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {cabin.capacidad} personas
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-xl font-bold text-gray-900">
                ${Number(cabin.costo_por_noche).toLocaleString()}
                <span className="text-sm font-normal text-gray-600 ml-1">MXN</span>
              </div>
              <a
                href={`/cabins/${cabin.id}`}
                className={`rounded-full px-6 py-2 text-sm text-white
                  ${cabin.estado === 'disponible' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-gray-400 cursor-not-allowed'}`}
                onClick={(e) => cabin.estado !== 'disponible' && e.preventDefault()}
              >
                {cabin.estado === 'disponible' ? 'Reservar Ahora' : 'No Disponible'}
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}