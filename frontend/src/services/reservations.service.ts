// src/services/reservationService.ts
import api from '@/lib/api';
import { ReservationFormData, ReservationResponse } from '@/types/reservationTypes';
import { AxiosError } from 'axios';
import { toSnakeCase } from '@/lib/utils';


export class ReservationService {
  static async createReservation(data: ReservationFormData): Promise<ReservationResponse> {
    try {
      const response = await api.post<ReservationResponse>('/reservas/reservas/', toSnakeCase(data));
      return response.data;
    } catch (error: unknown) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response?.data?.detail) {
          throw new Error(axiosError.response.data.detail);
        }
        if (axiosError.response?.data?.message) {
          throw new Error(axiosError.response.data.message);
        }
        throw new Error('Error al crear la reservación');
      }
    }     

  static async checkAvailability(
    cabanaId: number,
    fechaInicio: string,
    fechaFin: string
  ): Promise<{ available: boolean; message?: string }> {
    try {
      const response = await api.get('/reservas/reservas/check-availability/', {
        params: {
          cabana_id: cabanaId,
          fecha_inicio: fechaInicio,
          fecha_fin: fechaFin,
        },
      });
      return response.data;
    } catch (error) {
      return { available: false, message: 'Error al verificar disponibilidad' };
    }
  }

  static async getUserReservations(): Promise<ReservationResponse[]> {
    try {
      const response = await api.get<ReservationResponse[]>('/reservas/');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener reservaciones');
    }
  }

  static async cancelReservation(id: number): Promise<void> {
    try {
      await api.patch(`/reservas/${id}/`, { estado: 'cancelada' });
    } catch (error) {
      throw new Error('Error al cancelar la reservación');
    }
  }

  static async initiatePayment(reservationId: number,successUrl: string,cancelUrl: string): Promise<{ checkout_url: string }> {
    try {
      const response = await api.post(`/reservas/reservas/${reservationId}/pagar/`, {
        success_url: successUrl,
        cancel_url: cancelUrl
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<any>;
      if (axiosError.response?.data?.detail) {
        throw new Error(axiosError.response.data.detail);
      }
      throw new Error('Error al inicializar el pago');
    }
  }

  static async getReservationById(id: number): Promise<ReservationResponse> {
    try {
      const response = await api.get<ReservationResponse>(`/reservas/reservas/${id}/`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la reservación');
    }
  }
}