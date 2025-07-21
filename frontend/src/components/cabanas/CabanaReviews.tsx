// src/components/cabanas/CabanaReviews.tsx
import React, { useState } from 'react';
import { Resena } from '@/types/cabanasTypes';

interface CabanaReviewsProps {
  resenas: Resena[];
  calificacionPromedio: number;
  totalResenas: number;
}

const CabanaReviews: React.FC<CabanaReviewsProps> = ({ 
  resenas, 
  calificacionPromedio,
  totalResenas 
}) => {
  const [showAllReviews, setShowAllReviews] = useState(false);
  
  const displayedReviews = showAllReviews ? resenas : resenas.slice(0, 3);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span 
        key={index} 
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ⭐
      </span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Reseñas</h2>
        <div className="flex items-center gap-2">
          <div className="flex">
            {renderStars(Math.round(calificacionPromedio))}
          </div>
          <span className="font-medium">
            {calificacionPromedio.toFixed(1)}
          </span>
          <span className="text-gray-500">
            ({totalResenas} {totalResenas === 1 ? 'reseña' : 'reseñas'})
          </span>
        </div>
      </div>

      {resenas.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 text-5xl mb-4">💬</div>
          <p className="text-gray-500">
            Esta cabaña aún no tiene reseñas. ¡Sé el primero en dejar una!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {displayedReviews.map((resena) => (
              <div key={resena.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {resena.usuario_info.nombre?.charAt(0).toUpperCase() || 
                       resena.usuario_info.apellido?.charAt(0).toUpperCase() || 
                       resena.usuario_info.nombre_usuario.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {resena.usuario_info.nombre && resena.usuario_info.apellido
                          ? `${resena.usuario_info.nombre} ${resena.usuario_info.apellido}`
                          : resena.usuario_info.nombre_usuario
                        }
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(resena.fecha_creacion)}
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    {renderStars(resena.calificacion)}
                  </div>
                </div>
                
                <p className="text-gray-700 leading-relaxed">
                  {resena.comentario}
                </p>
              </div>
            ))}
          </div>

          {resenas.length > 3 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowAllReviews(!showAllReviews)}
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
              >
                {showAllReviews 
                  ? 'Mostrar menos reseñas' 
                  : `Ver las ${resenas.length - 3} reseñas restantes`
                }
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CabanaReviews;