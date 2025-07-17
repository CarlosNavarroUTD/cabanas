import React from 'react';
import CabanaCard from './CabanaCard';

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

interface CabanaGridProps {
  cabanas: Cabana[];
  favorites: number[];
  onToggleFavorite: (cabanaId: number) => void;
  onViewDetails?: (cabanaId: number) => void;
}

const CabanaGrid: React.FC<CabanaGridProps> = ({ 
  cabanas, 
  favorites, 
  onToggleFavorite, 
  onViewDetails 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {cabanas.map((cabana) => (
        <CabanaCard
          key={cabana.id}
          cabana={cabana}
          isFavorite={favorites.includes(cabana.id)}
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default CabanaGrid;