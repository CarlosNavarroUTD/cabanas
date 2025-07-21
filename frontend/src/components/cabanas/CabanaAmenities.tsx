// src/components/cabanas/CabanaAmenities.tsx
import React from 'react';
import { Servicio } from '@/types/cabanasTypes';

interface CabanaAmenitiesProps {
  servicios: Servicio[];
}

const CabanaAmenities: React.FC<CabanaAmenitiesProps> = ({ servicios }) => {
  if (servicios.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Servicios incluidos</h2>
        <p className="text-gray-500">No se han especificado servicios para esta cabaña.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Servicios incluidos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {servicios.map((servicio) => (
          <div 
            key={servicio.id}
            className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="text-2xl">
              {servicio.icono || '🏠'}
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">
                {servicio.nombre}
              </h3>
              {servicio.descripcion && (
                <p className="text-sm text-gray-600 mt-1">
                  {servicio.descripcion}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CabanaAmenities;