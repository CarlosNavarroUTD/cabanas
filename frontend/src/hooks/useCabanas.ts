// src/hooks/useCabanas.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { cabanasService } from '@/services/cabanas.service';
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

interface CabanasState {
  // Estados
  cabanas: CabanaList[];
  myCabanas: CabanaList[];
  currentCabana: CabanaDetail | null;
  servicios: Servicio[];
  resenas: Resena[];
  imagenes: ImagenCabana[];
  
  // Estados de carga
  loading: boolean;
  loadingCreate: boolean;
  loadingUpdate: boolean;
  loadingDelete: boolean;
  loadingImages: boolean;
  loadingResenas: boolean;
  
  // Errores
  error: string | null;
  
  // Filtros
  filters: CabanaFilters;

  isLoading: boolean;

  updateCabanaStatus: (cabanaId: number, status: string) => Promise<void>;

  // Acciones para servicios
  fetchServicios: () => Promise<void>;
  
  // Acciones para cabañas
  fetchCabanas: (filters?: CabanaFilters) => Promise<void>;
  fetchCabanaDetail: (id: number) => Promise<void>;
  fetchMyCabanas: () => Promise<void>;
  createCabana: (data: CabanaCreateUpdate) => Promise<CabanaDetail | null>;
  updateCabana: (id: number, data: Partial<CabanaCreateUpdate>) => Promise<CabanaDetail | null>;
  deleteCabana: (id: number) => Promise<boolean>;
  
  // Acciones para disponibilidad
  checkDisponibilidad: (cabanaId: number) => Promise<DisponibilidadResponse | null>;
  
  // Acciones para imágenes
  fetchImagenes: (cabanaId: number) => Promise<void>;
  agregarImagen: (cabanaId: number, data: ImagenCabanaCreate) => Promise<ImagenCabana | null>;
  updateImagen: (imagenId: number, data: Partial<ImagenCabanaCreate>) => Promise<ImagenCabana | null>;
  deleteImagen: (imagenId: number) => Promise<boolean>;
  
  // Acciones para reseñas
  fetchResenas: (cabanaId?: number) => Promise<void>;
  agregarResena: (cabanaId: number, data: ResenaCreate) => Promise<Resena | null>;
  updateResena: (resenaId: number, data: Partial<ResenaCreate>) => Promise<Resena | null>;
  deleteResena: (resenaId: number) => Promise<boolean>;
  
  // Acciones para filtros
  setFilters: (filters: Partial<CabanaFilters>) => void;
  clearFilters: () => void;
  
  // Acciones para limpiar estados
  clearError: () => void;
  clearCurrentCabana: () => void;
  reset: () => void;

  // Updated setCabanas to accept both arrays and updater functions
  setCabanas: (cabanas: CabanaList[] | ((prev: CabanaList[]) => CabanaList[])) => void;
  setError: (error: string | null) => void;
}

const initialState = {
  cabanas: [],
  myCabanas: [],
  currentCabana: null,
  servicios: [],
  resenas: [],
  imagenes: [],
  loading: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingImages: false,
  loadingResenas: false,
  error: null,
  filters: {},
  isLoading: false,
};

export const useCabanas = create<CabanasState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Updated setCabanas implementation
      setCabanas: (cabanas) => {
        if (typeof cabanas === 'function') {
          const currentCabanas = get().cabanas;
          const updatedCabanas = cabanas(currentCabanas);
          set({ cabanas: updatedCabanas });
        } else {
          set({ cabanas });
        }
      },
      
      setError: (error) => set({ error }),

      updateCabanaStatus: async (cabanaId: number, status: string) => {
        try {
          set({ loadingUpdate: true, error: null });
          await cabanasService.updateCabana(cabanaId, { status });
          
          const { cabanas, myCabanas } = get();
          set({ 
            cabanas: cabanas.map(c => c.id === cabanaId ? { ...c, status } : c),
            myCabanas: myCabanas.map(c => c.id === cabanaId ? { ...c, status } : c),
            loadingUpdate: false 
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar estado de cabaña',
            loadingUpdate: false 
          });
        }
      },

      // Servicios
      fetchServicios: async () => {
        const state = get();
        if (state.servicios.length > 0 || state.loading) return;
        
        try {
          set({ loading: true, error: null });
          const servicios = await cabanasService.getServicios();
          set({ servicios, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al obtener servicios',
            loading: false 
          });
        }
      },

     // Cabañas - CORREGIDO para manejar el filtro de equipo correctamente
     fetchCabanas: async (filters?: CabanaFilters) => {
      try {
        set({ loading: true, isLoading: true, error: null });
        
        const safeFilters: CabanaFilters = {
          ...filters,
          ordering: (filters?.ordering || '-creada_en') as CabanaFilters['ordering'],
        };
        
        // Asegurarse de que el filtro de equipo se pase correctamente
        const cabanas = await cabanasService.getCabanas(safeFilters);
        set({ cabanas, loading: false, isLoading: false }); 
        
        // Solo actualizar filtros si cambiaron
        if (filters && JSON.stringify(filters) !== JSON.stringify(get().filters)) {
          set({ filters: safeFilters });
        }
      } catch (error) {
        set({ 
          error: error instanceof Error ? error.message : 'Error al obtener cabañas',
          loading: false,
          isLoading: false 
        });
      }
    },
      
      fetchCabanaDetail: async (id: number) => {
        try {
          set({ loading: true, error: null });
          const currentCabana = await cabanasService.getCabanaDetail(id);
          set({ currentCabana, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al obtener detalle de cabaña',
            loading: false 
          });
        }
      },

      fetchMyCabanas: async () => {
        try {
          set({ loading: true, error: null });
          const myCabanas = await cabanasService.getMyCabanas();
          set({ myCabanas, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al obtener mis cabañas',
            loading: false 
          });
        }
      },

      createCabana: async (data: CabanaCreateUpdate) => {
        try {
          set({ loadingCreate: true, error: null });
          const newCabana = await cabanasService.createCabana(data);
          
          // Actualizar la lista de cabañas
          const { cabanas, myCabanas } = get();
          set({ 
            cabanas: [...cabanas, newCabana],
            myCabanas: [...myCabanas, newCabana],
            loadingCreate: false 
          });
          
          return newCabana;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al crear cabaña',
            loadingCreate: false 
          });
          return null;
        }
      },

      updateCabana: async (id: number, data: Partial<CabanaCreateUpdate>) => {
        try {
          set({ loadingUpdate: true, error: null });
          const updatedCabana = await cabanasService.updateCabana(id, data);
          
          // Actualizar en las listas
          const { cabanas, myCabanas } = get();
          set({ 
            cabanas: cabanas.map(c => c.id === id ? updatedCabana : c),
            myCabanas: myCabanas.map(c => c.id === id ? updatedCabana : c),
            currentCabana: updatedCabana,
            loadingUpdate: false 
          });
          
          return updatedCabana;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar cabaña',
            loadingUpdate: false 
          });
          return null;
        }
      },

      deleteCabana: async (id: number) => {
        try {
          set({ loadingDelete: true, error: null });
          await cabanasService.deleteCabana(id);
          
          // Remover de las listas
          const { cabanas, myCabanas } = get();
          set({ 
            cabanas: cabanas.filter(c => c.id !== id),
            myCabanas: myCabanas.filter(c => c.id !== id),
            currentCabana: null,
            loadingDelete: false 
          });
          
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al eliminar cabaña',
            loadingDelete: false 
          });
          return false;
        }
      },

      // Disponibilidad
      checkDisponibilidad: async (cabanaId: number) => {
        try {
          set({ loading: true, error: null });
          const disponibilidad = await cabanasService.getDisponibilidad(cabanaId);
          set({ loading: false });
          return disponibilidad;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al verificar disponibilidad',
            loading: false 
          });
          return null;
        }
      },

      // Imágenes
      fetchImagenes: async (cabanaId: number) => {
        try {
          set({ loadingImages: true, error: null });
          const imagenes = await cabanasService.getImagenesCabana(cabanaId);
          set({ imagenes, loadingImages: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al obtener imágenes',
            loadingImages: false 
          });
        }
      },

      agregarImagen: async (cabanaId: number, data: ImagenCabanaCreate) => {
        try {
          set({ loadingImages: true, error: null });
          const newImagen = await cabanasService.agregarImagen(cabanaId, data);
          
          const { imagenes } = get();
          set({ 
            imagenes: [...imagenes, newImagen],
            loadingImages: false 
          });
          
          return newImagen;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al agregar imagen',
            loadingImages: false 
          });
          return null;
        }
      },

      updateImagen: async (imagenId: number, data: Partial<ImagenCabanaCreate>) => {
        try {
          set({ loadingImages: true, error: null });
          const updatedImagen = await cabanasService.updateImagen(imagenId, data);
          
          const { imagenes } = get();
          set({ 
            imagenes: imagenes.map(img => img.id === imagenId ? updatedImagen : img),
            loadingImages: false 
          });
          
          return updatedImagen;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar imagen',
            loadingImages: false 
          });
          return null;
        }
      },

      deleteImagen: async (imagenId: number) => {
        try {
          set({ loadingImages: true, error: null });
          await cabanasService.deleteImagen(imagenId);
          
          const { imagenes } = get();
          set({ 
            imagenes: imagenes.filter(img => img.id !== imagenId),
            loadingImages: false 
          });
          
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al eliminar imagen',
            loadingImages: false 
          });
          return false;
        }
      },

      // Reseñas
      fetchResenas: async (cabanaId?: number) => {
        try {
          set({ loadingResenas: true, error: null });
          const resenas = await cabanasService.getResenas(cabanaId);
          set({ resenas, loadingResenas: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al obtener reseñas',
            loadingResenas: false 
          });
        }
      },

      agregarResena: async (cabanaId: number, data: ResenaCreate) => {
        try {
          set({ loadingResenas: true, error: null });
          const newResena = await cabanasService.agregarResena(cabanaId, data);
          
          const { resenas } = get();
          set({ 
            resenas: [...resenas, newResena],
            loadingResenas: false 
          });
          
          return newResena;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al agregar reseña',
            loadingResenas: false 
          });
          return null;
        }
      },

      updateResena: async (resenaId: number, data: Partial<ResenaCreate>) => {
        try {
          set({ loadingResenas: true, error: null });
          const updatedResena = await cabanasService.updateResena(resenaId, data);
          
          const { resenas } = get();
          set({ 
            resenas: resenas.map(r => r.id === resenaId ? updatedResena : r),
            loadingResenas: false 
          });
          
          return updatedResena;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al actualizar reseña',
            loadingResenas: false 
          });
          return null;
        }
      },

      deleteResena: async (resenaId: number) => {
        try {
          set({ loadingResenas: true, error: null });
          await cabanasService.deleteResena(resenaId);
          
          const { resenas } = get();
          set({ 
            resenas: resenas.filter(r => r.id !== resenaId),
            loadingResenas: false 
          });
          
          return true;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error al eliminar reseña',
            loadingResenas: false 
          });
          return false;
        }
      },

      // Filtros
      setFilters: (newFilters: Partial<CabanaFilters>) => {
        const { filters } = get();
        set({ filters: { ...filters, ...newFilters } });
      },

      clearFilters: () => {
        set({ filters: {} });
      },

      // Utilidades
      clearError: () => set({ error: null }),
      
      clearCurrentCabana: () => set({ currentCabana: null }),
      
      reset: () => set(initialState),
    }),
    {
      name: 'cabanas-store',
    }
  )
);