// src/hooks/useReservationForm.ts
import { useState, useMemo } from 'react';
import { ReservationData, StayCalculation } from '@/types/reservationTypes';
import { CabanaDetail } from '@/types/cabanasTypes';
import { ReservationService } from '@/services/reservations.service';
import { ReservationResponse } from '@/types/reservationTypes';


// Función helper para obtener información del usuario
const getUserFromStorage = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;

    return JSON.parse(userString);
  } catch (error) {
    console.error('Error al obtener usuario desde localStorage:', error);
    return null;
  }
};


export const useReservationForm = (cabana: CabanaDetail) => {
  const [formData, setFormData] = useState<ReservationData>({
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
    comentarios: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);


  // Obtener información del usuario
  const user = useMemo(() => getUserFromStorage(), []);

  // Calcular información de la estancia
  const stayInfo = useMemo((): StayCalculation | null => {
    if (!formData.fechaInicio || !formData.fechaFin) return null;

    const inicio = new Date(formData.fechaInicio);
    const fin = new Date(formData.fechaFin);
    const diffTime = fin.getTime() - inicio.getTime();
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (nights <= 0) return null;

    return {
      nights,
      totalCost: nights * cabana.costo_por_noche
    };
  }, [formData.fechaInicio, formData.fechaFin, cabana.costo_por_noche]);

  // Fechas mínimas para los inputs
  const dateConstraints = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const minCheckout = formData.fechaInicio
      ? new Date(new Date(formData.fechaInicio).getTime() + 86400000)
        .toISOString()
        .split('T')[0]
      : today;

    return { today, minCheckout };
  }, [formData.fechaInicio]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'huespedes' ? parseInt(value) || 1 : value
    }));
    if (error) setError(null);
  };

  const validateForm = (): string | null => {
    // Validar que el usuario esté autenticado
    if (!user) {
      return 'Debe iniciar sesión para realizar una reservación';
    }

    // Validar que tenga información de cliente
    if (!user.persona?.cliente?.id_cliente) {
      return 'No se encontró información de cliente válida';
    }

    if (!formData.fechaInicio || !formData.fechaFin) {
      return 'Las fechas de entrada y salida son obligatorias';
    }

    if (new Date(formData.fechaInicio) >= new Date(formData.fechaFin)) {
      return 'La fecha de salida debe ser posterior a la fecha de entrada';
    }

    if (formData.huespedes > cabana.capacidad) {
      return `El número máximo de huéspedes es ${cabana.capacidad}`;
    }

    if (formData.huespedes < 1) {
      return 'Debe haber al menos 1 huésped';
    }

    return null;
  };

  const checkAvailability = async (): Promise<boolean> => {
    if (!formData.fechaInicio || !formData.fechaFin) return false;

    setCheckingAvailability(true);
    try {
      const result = await ReservationService.checkAvailability(
        cabana.id,
        formData.fechaInicio,
        formData.fechaFin
      );

      if (!result.available && result.message) {
        setError(result.message);
        return false;
      }

      return result.available;
    } catch {
      setError('Error al verificar disponibilidad');
      return false;
    } finally {
      setCheckingAvailability(false);
    }
  };

  // Dentro de hook useReservationForm
  const submitReservation = async (urlOptions?: {
    generateSuccessUrl: (reservationId: number) => string;
    cancelUrl: string;
  }): Promise<ReservationResponse> => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      throw new Error(validationError);
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Verificar disponibilidad
      const isAvailable = await checkAvailability();
      if (!isAvailable) {
        throw new Error('La cabaña no está disponible en las fechas seleccionadas');
      }

      // 2. Crear reservación
      const reservationData = {
        ...formData,
        cabanas: [cabana.id],
        cliente: user.persona.cliente.id_cliente,
        precio_final: stayInfo ? stayInfo.totalCost : 0
      };

      const reservation = await ReservationService.createReservation(reservationData);

      if (urlOptions) {
        const successUrl = urlOptions.generateSuccessUrl(reservation.id);
        await initiatePaymentProcess(reservation.id, successUrl, urlOptions.cancelUrl);
      } else {
        const baseUrl = window.location.origin;
        const successUrl = `${baseUrl}/app/reserva/${reservation.id}`;
        const cancelUrl = window.location.href;
        await initiatePaymentProcess(reservation.id, successUrl, cancelUrl);
      }

      return reservation; // ✅ retornas la reserva, no el resultado del pago


    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la reservación';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const initiatePaymentProcess = async (
    reservationId: number,
    successUrl: string,
    cancelUrl: string
  ) => {
    setProcessingPayment(true);
    try {
      const paymentData = await ReservationService.initiatePayment(
        reservationId,
        successUrl,
        cancelUrl
      );

      // Redirigir a Stripe Checkout
      window.location.href = paymentData.checkout_url;

      return { reservationId, paymentUrl: paymentData.checkout_url };
    } catch (err) {
      setError('Error al procesar el pago');
      throw err;
    } finally {
      setProcessingPayment(false);
    }
  };

  const resetForm = () => {
    setFormData({
      fechaInicio: '',
      fechaFin: '',
      huespedes: 1,
      comentarios: ''
    });
    setError(null);
  };

  return {
    formData,
    loading,
    error,
    checkingAvailability,
    stayInfo,
    dateConstraints,
    user, // Exponer información del usuario para uso en componentes
    handleInputChange,
    submitReservation,
    checkAvailability,
    resetForm,
    setError,
    processingPayment,
    initiatePaymentProcess,
  };
};