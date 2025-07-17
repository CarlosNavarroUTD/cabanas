// src/services/cabanas.service.ts
import api from '@/lib/api';
import { 
  CabanaList, 
  CabanaDetail, 
  CabanaCreateUpdate, 
  Servicio, 
  ImagenCabana, 
  ImagenCabanaCreate, 
  Resena, 
  ResenaCreate, 
  DisponibilidadResponse,
  CabanaFilters 
} from '@/types/cabanasTypes';

export const cabanasService = {
  // Servicios
  async getServicios() {
    const response = await api.get('/cabanas/servicios/');
    return response.data as Servicio[];
  },

  // Cabañas - CRUD
  async createCabana(data: CabanaCreateUpdate) {
    const response = await api.post('/cabanas/cabanas/', data);
    return response.data as CabanaDetail;
  },

  async getCabanas(filters?: CabanaFilters) {
    const params = new URLSearchParams();
    
    if (filters?.estado) params.append('estado', filters.estado);
    if (filters?.capacidad) params.append('capacidad', filters.capacidad.toString());
    if (filters?.permite_mascotas !== undefined) params.append('permite_mascotas', filters.permite_mascotas.toString());
    if (filters?.team) params.append('team', filters.team.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.ordering) params.append('ordering', filters.ordering);

    const response = await api.get(`/cabanas/cabanas/?${params.toString()}`);
    return response.data as CabanaList[];
  },

  async getCabanaDetail(id: number) {
    const response = await api.get(`/cabanas/cabanas/${id}/`);
    return response.data as CabanaDetail;
  },

  async updateCabana(id: number, data: Partial<CabanaCreateUpdate>) {
    const response = await api.patch(`/cabanas/cabanas/${id}/`, data);
    return response.data as CabanaDetail;
  },

  async deleteCabana(id: number) {
    await api.delete(`/cabanas/cabanas/${id}/`);
  },

  // Cabañas del usuario
  async getMyCabanas() {
    const response = await api.get('/cabanas/cabanas/mis_cabanas/');
    return response.data as CabanaList[];
  },

  // Cabañas por ID de equipo
  async getCabanasByTeam(teamId: number) {
    const response = await api.get(`/cabanas/cabanas/team/${teamId}/`);
    return response.data as CabanaList[];
  },

  // Disponibilidad
  async getDisponibilidad(cabanaId: number) {
    const response = await api.get(`/cabanas/cabanas/${cabanaId}/disponibilidad/`);
    return response.data as DisponibilidadResponse;
  },

  // Imágenes
  async getImagenesCabana(cabanaId: number) {
    const response = await api.get(`/cabanas/imagenes/?cabana_id=${cabanaId}`);
    return response.data as ImagenCabana[];
  },

  async agregarImagen(cabanaId: number, data: ImagenCabanaCreate) {
    const formData = new FormData();
    formData.append('imagen', data.imagen);
    formData.append('orden', data.orden.toString());
    if (data.es_principal) formData.append('es_principal', 'true');
    if (data.descripcion) formData.append('descripcion', data.descripcion);

    const response = await api.post(`/cabanas/cabanas/${cabanaId}/agregar_imagen/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as ImagenCabana;
  },

  async updateImagen(imagenId: number, data: Partial<ImagenCabanaCreate>) {
    const formData = new FormData();
    if (data.imagen) formData.append('imagen', data.imagen);
    if (data.orden) formData.append('orden', data.orden.toString());
    if (data.es_principal !== undefined) formData.append('es_principal', data.es_principal.toString());
    if (data.descripcion) formData.append('descripcion', data.descripcion);

    const response = await api.patch(`/cabanas/imagenes/${imagenId}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data as ImagenCabana;
  },

  async deleteImagen(imagenId: number) {
    await api.delete(`/cabanas/imagenes/${imagenId}/`);
  },

  // Reseñas
  async getResenas(cabanaId?: number) {
    const url = cabanaId ? `/cabanas/resenas/?cabana_id=${cabanaId}` : '/cabanas/resenas/';
    const response = await api.get(url);
    return response.data as Resena[];
  },

  async agregarResena(cabanaId: number, data: ResenaCreate) {
    const response = await api.post(`/cabanas/cabanas/${cabanaId}/agregar_resena/`, data);
    return response.data as Resena;
  },

  async updateResena(resenaId: number, data: Partial<ResenaCreate>) {
    const response = await api.patch(`/cabanas/resenas/${resenaId}/`, data);
    return response.data as Resena;
  },

  async deleteResena(resenaId: number) {
    await api.delete(`/cabanas/resenas/${resenaId}/`);
  },

  // Método alternativo para crear reseña directamente
  async createResena(data: ResenaCreate & { cabana_id: number }) {
    const response = await api.post('/cabanas/resenas/', data);
    return response.data as Resena;
  }
};