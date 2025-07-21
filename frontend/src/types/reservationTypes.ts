// src/types/reservationTypes.ts
import { CabanaDetail } from '@/types/cabanasTypes';

export interface ReservationData {
  fechaInicio: string;
  fechaFin: string;
  huespedes: number;
  comentarios: string;
}

export interface ReservationFormData extends ReservationData {
  cabanas: number[];
  cliente: number; // El serializer espera 'cliente'
  precio_final: number;
}

export interface StayCalculation {
  nights: number;
  totalCost: number;
}

export interface ReservationResponse {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  huespedes: number;
  comentarios: string;
  cabana_id: number;
  total: number;
  estado: string;
  created_at: string;
}

export interface ReservationFormProps {
  cabana: CabanaDetail;
  onClose: () => void;
  onSuccess?: (reservation: ReservationResponse) => void;
}

// Tipos para la información del usuario desde localStorage
export interface UserInfo {
  id_usuario: number;
  nombre_usuario: string;
  email: string;
  tipo_usuario: string;
  rol: string;
  phone: string;
  persona: {
    id_persona: number;
    nombre: string;
    apellido: string;
    cliente: {
      id_cliente: number;
    };
    arrendador: {
      id_arrendador: number;
    };
  };
}