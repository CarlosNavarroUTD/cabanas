//src/app/(public)/cabanas/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation'; // Changed import
import { useCabanas } from '@/hooks/useCabanas';
import { useAuth } from '@/hooks/useAuth';
import CabanaImageGallery from '@/components/cabanas/CabanaImageGallery';
import CabanaInfo from '@/components/cabanas/CabanaInfo';
import CabanaAmenities from '@/components/cabanas/CabanaAmenities';
import CabanaReviews from '@/components/cabanas/CabanaReviews';
import ReservationForm from '@/components/reservations/ReservationForm';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

const CabanaDetailPublicPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const router = useRouter(); // Added router hook
  const { isAuthenticated } = useAuth();
  const { 
    currentCabana, 
    loading, 
    error, 
    fetchCabanaDetail, 
    clearError,
    clearCurrentCabana 
  } = useCabanas();

  const [showReservationForm, setShowReservationForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const cabanaId = parseInt(id);
    if (isNaN(cabanaId)) {
      router.replace('/cabanas'); // Redirigir inmediatamente si el ID es inválido
      return;
    }

    fetchCabanaDetail(cabanaId);

    return () => {
      clearCurrentCabana();
      clearError();
    };
  }, [id, fetchCabanaDetail, clearCurrentCabana, clearError]);

  const handleReserveClick = () => {
    if (!isAuthenticated) {
      // Redirigir al login o mostrar modal de login
      // Por ahora solo mostramos alert
      alert('Debes iniciar sesión para realizar una reservación');
      return;
    }
    setShowReservationForm(true);
  };

  useEffect(() => {
    if (!loading && error && error.includes('404')) {
      router.replace('/cabanas');
    }
  }, [loading, error, router]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!currentCabana) {
    return null; // Esperando redirección
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentCabana.nombre}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              ⭐ {currentCabana.calificacion_promedio.toFixed(1)} 
              ({currentCabana.total_resenas} reseñas)
            </span>
            <span>•</span>
            <span>{currentCabana.team_name}</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <CabanaImageGallery 
              imagenes={currentCabana.imagenes}
              nombreCabana={currentCabana.nombre}
            />

            {/* Basic Info */}
            <CabanaInfo cabana={currentCabana} />

            {/* Amenities */}
            <CabanaAmenities servicios={currentCabana.servicios} />

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Descripción</h2>
              <p className="text-gray-700 leading-relaxed">
                {currentCabana.descripcion}
              </p>
              
              {currentCabana.reglas_casa && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2">Reglas de la casa</h3>
                  <p className="text-gray-600 text-sm">
                    {currentCabana.reglas_casa}
                  </p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <CabanaReviews 
              resenas={currentCabana.resenas}
              calificacionPromedio={currentCabana.calificacion_promedio}
              totalResenas={currentCabana.total_resenas}
            />
          </div>

          {/* Right Column - Reservation Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-lg border p-6">
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      ${currentCabana.costo_por_noche.toLocaleString()}
                    </span>
                    <span className="text-gray-600">/ noche</span>
                  </div>
                </div>

                {currentCabana.estado === 'disponible' ? (
                  <>
                    {!showReservationForm ? (
                      <button
                        onClick={handleReserveClick}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                      >
                        Reservar ahora
                      </button>
                    ) : (
                      <ReservationForm
                        cabana={currentCabana}
                        onClose={() => setShowReservationForm(false)}
                      />
                    )}
                  </>
                ) : (
                  <div className="text-center">
                    <div className="bg-gray-100 text-gray-600 py-3 px-4 rounded-lg">
                      {currentCabana.estado === 'ocupada' ? 'Ocupada' : 'En mantenimiento'}
                    </div>
                  </div>
                )}

                {/* Quick Info */}
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Capacidad:</span>
                    <span>{currentCabana.capacidad} personas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Habitaciones:</span>
                    <span>{currentCabana.numero_habitaciones}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Baños:</span>
                    <span>{currentCabana.numero_banos}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-in:</span>
                    <span>{currentCabana.hora_checkin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Check-out:</span>
                    <span>{currentCabana.hora_checkout}</span>
                  </div>
                  {currentCabana.permite_mascotas && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mascotas:</span>
                      <span className="text-green-600">Permitidas</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CabanaDetailPublicPage;