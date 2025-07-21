// src/components/reservations/ReservationForm.tsx
import React from 'react';
import { ReservationFormProps } from '@/types/reservationTypes';
import { useReservationForm } from '@/hooks/useReservations';

const ReservationForm: React.FC<ReservationFormProps> = ({ 
  cabana, 
  onClose, 
  onSuccess 
}) => {
  const {
    formData,
    loading,
    error,
    checkingAvailability,
    stayInfo,
    dateConstraints,
    handleInputChange,
    submitReservation,
    resetForm
  } = useReservationForm(cabana);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const reservation = await submitReservation();
      
      if (onSuccess) {
        onSuccess(reservation);
      } else {
        alert('¡Reservación creada exitosamente!');
      }
      
      resetForm();
      onClose();
    } catch (err) {
      // Error ya manejado en el hook
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Reservar {cabana.nombre}
        </h2>
        <p className="text-gray-600 text-sm">
          Capacidad: {cabana.capacidad} huéspedes • ${cabana.costo_por_noche} MXN/noche
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de entrada
            </label>
            <input
              type="date"
              name="fechaInicio"
              min={dateConstraints.today}
              value={formData.fechaInicio}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha de salida
            </label>
            <input
              type="date"
              name="fechaFin"
              min={dateConstraints.minCheckout}
              value={formData.fechaFin}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Número de huéspedes
          </label>
          <input
            type="number"
            name="huespedes"
            min={1}
            max={cabana.capacidad}
            value={formData.huespedes}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
          <p className="text-xs text-gray-500 mt-1">
            Máximo {cabana.capacidad} huéspedes
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comentarios adicionales
          </label>
          <textarea
            name="comentarios"
            value={formData.comentarios}
            onChange={handleInputChange}
            rows={3}
            disabled={loading}
            placeholder="Solicitudes especiales, alergias, etc..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 resize-none"
          />
        </div>

        {/* Información del cálculo */}
        {stayInfo && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-700 font-medium">
                {stayInfo.nights} noche{stayInfo.nights !== 1 ? 's' : ''}
              </span>
              <span className="text-green-800 font-bold text-lg">
                ${stayInfo.totalCost.toLocaleString()} MXN
              </span>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Total por {stayInfo.nights} noche{stayInfo.nights !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* Mensajes de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Estados de carga */}
        {checkingAvailability && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-blue-700 text-sm">Verificando disponibilidad...</p>
          </div>
        )}

        {/* Botones */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={loading || checkingAvailability}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : 'Confirmar Reservación'}
          </button>
          
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-md transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationForm;