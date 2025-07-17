// src/types/cabanasTypes.ts

export interface Servicio {
    id: number;
    nombre: string;
    icono: string;
    descripcion: string;
    activo: boolean;
  }
  
  export interface ImagenCabana {
    id: number;
    imagen: string;
    es_principal: boolean;
    descripcion?: string;
    orden: number;
    creada_en: string;
  }
  
  export interface UsuarioInfo {
    nombre?: string;
    apellido?: string;
    nombre_usuario: string;
  }
  
  export interface Resena {
    id: number;
    calificacion: number;
    comentario: string;
    fecha_creacion: string;
    fecha_actualizacion: string;
    usuario: number;
    usuario_info: UsuarioInfo;
  }
  
  export interface Team {
    id: number;
    name: string;
    description?: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface CabanaList {
    id: number;
    slug: string;
    nombre: string;
    descripcion: string;
    capacidad: number;
    costo_por_noche: number;
    estado: 'disponible' | 'ocupada' | 'mantenimiento';
    servicios: Servicio[];
    superficie?: number;
    numero_habitaciones: number;
    numero_banos: number;
    permite_mascotas: boolean;
    imagen_principal: string | null;
    calificacion_promedio: number;
    total_resenas: number;
    team_name: string;
    creada_en: string;
  }
  
  export interface CabanaDetail extends CabanaList {
    reglas_casa?: string;
    hora_checkin: string;
    hora_checkout: string;
    imagenes: ImagenCabana[];
    resenas: Resena[];
    team: Team;
    actualizada_en: string;
  }
  
  export interface CabanaCreateUpdate {
    nombre: string;
    descripcion: string;
    capacidad: number;
    costo_por_noche: number;
    estado: 'disponible' | 'ocupada' | 'mantenimiento';
    servicios?: number[];
    superficie?: number;
    numero_habitaciones: number;
    numero_banos: number;
    permite_mascotas: boolean;
    reglas_casa?: string;
    hora_checkin: string;
    hora_checkout: string;
    team_id?: number;
  }
  
  export interface ImagenCabanaCreate {
    imagen: File;
    es_principal?: boolean;
    descripcion?: string;
    orden: number;
    cabana_id?: number;
  }
  
  export interface ResenaCreate {
    calificacion: number;
    comentario: string;
    cabana_id?: number;
  }
  
  export interface DisponibilidadResponse {
    cabana_id: number;
    nombre: string;
    estado: string;
    disponible: boolean;
    mensaje: string;
  }
  
  export interface CabanaFilters {
    estado?: 'disponible' | 'ocupada' | 'mantenimiento';
    capacidad?: number;
    permite_mascotas?: boolean;
    team?: number;
    search?: string;
    ordering?: 'costo_por_noche' | '-costo_por_noche' | 'capacidad' | '-capacidad' | 'creada_en' | '-creada_en' | 'calificacion_promedio' | '-calificacion_promedio';
  }
  
  export type Cabanas = CabanaList;