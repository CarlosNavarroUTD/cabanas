// src/components/cabanas/CabanaInfo.tsx
import React from 'react';
import { CabanaDetail } from '@/types/cabanasTypes';

interface CabanaInfoProps {
  cabana: CabanaDetail;
}

const CabanaInfo: React.FC<CabanaInfoProps> = ({ cabana }) => {
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'bg-green-100 text-green-800';
      case 'ocupada':
        return 'bg-red-100 text-red-800';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (estado: string) => {
    switch (estado) {
      case 'disponible':
        return 'Disponible';
      case 'ocupada':
        return 'Ocupada';
      case 'mantenimiento':
        return 'En mantenimiento';
      default:
        return estado;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Información básica</h2>
          <div className="flex items-center gap-2">
            <span 
              className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cabana.estado)}`}
            >
              {getStatusText(cabana.estado)}
            </span>
            <span className="text-gray-500 text-sm">•</span>
            <span className="text-sm text-gray-600">
              Publicada: {new Date(cabana.creada_en).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl mb-1">👥</div>
          <div className="text-lg font-semibold">{cabana.capacidad}</div>
          <div className="text-sm text-gray-600">Personas</div>
        </div>

        <div className="text-center">
          <div className="text-2xl mb-1">🛏️</div>
          <div className="text-lg font-semibold">{cabana.numero_habitaciones}</div>
          <div className="text-sm text-gray-600">Habitaciones</div>
        </div>

        <div className="text-center">
          <div className="text-2xl mb-1">🚿</div>
          <div className="text-lg font-semibold">{cabana.numero_banos}</div>
          <div className="text-sm text-gray-600">Baños</div>
        </div>

        <div className="text-center">
          <div className="text-2xl mb-1">📐</div>
          <div className="text-lg font-semibold">
            {cabana.superficie ? `${cabana.superficie}m²` : 'N/A'}
          </div>
          <div className="text-sm text-gray-600">Superficie</div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-900">Check-in:</span>
            <span className="ml-2 text-gray-600">{cabana.hora_checkin}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Check-out:</span>
            <span className="ml-2 text-gray-600">{cabana.hora_checkout}</span>
          </div>
          <div>
            <span className="font-medium text-gray-900">Mascotas:</span>
            <span className={`ml-2 ${cabana.permite_mascotas ? 'text-green-600' : 'text-red-600'}`}>
              {cabana.permite_mascotas ? 'Permitidas' : 'No permitidas'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabanaInfo;