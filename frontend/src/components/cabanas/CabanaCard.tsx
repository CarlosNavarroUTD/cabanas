//src/components/cabanas/CabanaCard.tsx

import React from 'react';
import { 
  Users, 
  Star, 
  Heart, 
  Wifi,
  Car,
  Coffee,
  PawPrint,
  Bath,
  Bed,
  Home,
  Edit,
  Power,
  PowerOff
} from 'lucide-react';

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Cabana {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  numero_habitaciones: number;
  numero_banos: number;
  costo_por_noche: number;
  permite_mascotas: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  imagen_principal?: string;
  calificacion_promedio: number;
  total_resenas: number;
  team_name: string;
  servicios: Servicio[];
}

interface CabanaCardProps {
  cabana: Cabana;
  // Props para vista pública
  isFavorite?: boolean;
  onToggleFavorite?: (cabanaId: number) => void;
  onViewDetails?: (cabanaId: number) => void;
  // Props para vista admin
  isAdmin?: boolean;
  onEdit?: (cabanaId: number) => void;
  onToggle?: (cabanaId: number, currentStatus: string) => void;
}

const CabanaCard: React.FC<CabanaCardProps> = ({ 
  cabana, 
  isFavorite = false,
  onToggleFavorite, 
  onViewDetails,
  isAdmin = false,
  onEdit,
  onToggle
}) => {
  const getServiceIcon = (serviceName: string) => {
    const name = serviceName.toLowerCase();
    if (name.includes('wifi') || name.includes('internet')) return <Wifi className="w-4 h-4" />;
    if (name.includes('parking') || name.includes('estacionamiento')) return <Car className="w-4 h-4" />;
    if (name.includes('café') || name.includes('coffee') || name.includes('cocina')) return <Coffee className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  const getStatusBadgeStyle = (estado: string) => {
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
        return 'Mantenimiento';
      default:
        return estado;
    }
  };

  const isActive = cabana.estado !== 'mantenimiento';

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Image */}
      <div className="relative h-48 bg-gray-200">
        {cabana.imagen_principal ? (
          <img
            src={cabana.imagen_principal}
            alt={cabana.nombre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-12 h-12 text-gray-400" />
          </div>
        )}
        
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(cabana.estado)}`}>
            {getStatusText(cabana.estado)}
          </span>
        </div>

        {/* Right side buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          {isAdmin ? (
            /* Admin buttons */
            <>
              <button
                onClick={() => onEdit?.(cabana.id)}
                className="p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                title="Editar cabaña"
              >
                <Edit className="w-4 h-4 text-gray-700" />
              </button>
              <button
                onClick={() => onToggle?.(cabana.id, cabana.estado)}
                className={`p-2 rounded-full transition-colors ${
                  isActive 
                    ? 'bg-red-500/90 hover:bg-red-500 text-white' 
                    : 'bg-green-500/90 hover:bg-green-500 text-white'
                }`}
                title={isActive ? 'Desactivar cabaña' : 'Activar cabaña'}
              >
                {isActive ? (
                  <PowerOff className="w-4 h-4" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
              </button>
            </>
          ) : (
            /* Public view - Favorite button */
            <button
              onClick={() => onToggleFavorite?.(cabana.id)}
              className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors"
            >
              <Heart 
                className={`w-4 h-4 ${
                  isFavorite 
                    ? 'fill-red-500 text-red-500' 
                    : 'text-gray-600'
                }`} 
              />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title and rating */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {cabana.nombre}
          </h3>
          {cabana.calificacion_promedio > 0 && (
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="ml-1 text-sm text-gray-600">
                {cabana.calificacion_promedio.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* Team name - only show in public view */}
        {!isAdmin && (
          <p className="text-sm text-gray-500 mb-2">{cabana.team_name}</p>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {cabana.descripcion}
        </p>

        {/* Details */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-1" />
            <span>{cabana.capacidad}</span>
          </div>
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{cabana.numero_habitaciones}</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{cabana.numero_banos}</span>
          </div>
          {cabana.permite_mascotas && (
            <PawPrint className="w-4 h-4 text-green-600" />
          )}
        </div>

        {/* Services */}
        {cabana.servicios.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {cabana.servicios.slice(0, 3).map((servicio) => (
              <div
                key={servicio.id}
                className="flex items-center bg-gray-100 px-2 py-1 rounded-full"
                title={servicio.descripcion}
              >
                {getServiceIcon(servicio.nombre)}
                <span className="ml-1 text-xs text-gray-700 truncate">
                  {servicio.nombre}
                </span>
              </div>
            ))}
            {cabana.servicios.length > 3 && (
              <div className="flex items-center bg-gray-100 px-2 py-1 rounded-full">
                <span className="text-xs text-gray-700">
                  +{cabana.servicios.length - 3}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Price and reviews */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(cabana.costo_por_noche)}
            </span>
            <span className="text-sm text-gray-500"> /noche</span>
          </div>
          <div className="text-sm text-gray-500">
            {cabana.total_resenas} reseña{cabana.total_resenas !== 1 ? 's' : ''}
          </div>
        </div>

        {/* Action buttons */}
        {isAdmin ? (
          /* Admin action buttons */
          <div className="flex space-x-2">
            <button 
              onClick={() => onEdit?.(cabana.id)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </button>
            <button 
              onClick={() => onToggle?.(cabana.id, cabana.estado)}
              className={`flex-1 py-2 px-4 rounded-lg transition-colors flex items-center justify-center ${
                isActive 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isActive ? (
                <>
                  <PowerOff className="w-4 h-4 mr-2" />
                  Desactivar
                </>
              ) : (
                <>
                  <Power className="w-4 h-4 mr-2" />
                  Activar
                </>
              )}
            </button>
          </div>
        ) : (
          /* Public view - View details button */
          <button 
            onClick={() => onViewDetails?.(cabana.id)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Ver detalles
          </button>
        )}
      </div>
    </div>
  );
};

export default CabanaCard;