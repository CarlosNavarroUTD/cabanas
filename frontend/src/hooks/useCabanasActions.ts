// src/hooks/useCabanasActions.ts
import { useCabanas } from './useCabanas';

export const useCabanasActions = () => {
  // Simplemente devolver las funciones directamente
  // Las funciones de Zustand ya están optimizadas internamente
  return useCabanas((state) => ({
    fetchCabanas: state.fetchCabanas,
    fetchCabanaDetail: state.fetchCabanaDetail,
    fetchMyCabanas: state.fetchMyCabanas,
    createCabana: state.createCabana,
    updateCabana: state.updateCabana,
    deleteCabana: state.deleteCabana,
    fetchServicios: state.fetchServicios,
    checkDisponibilidad: state.checkDisponibilidad,
    fetchImagenes: state.fetchImagenes,
    agregarImagen: state.agregarImagen,
    updateImagen: state.updateImagen,
    deleteImagen: state.deleteImagen,
    fetchResenas: state.fetchResenas,
    agregarResena: state.agregarResena,
    updateResena: state.updateResena,
    deleteResena: state.deleteResena,
    setFilters: state.setFilters,
    clearFilters: state.clearFilters,
    clearError: state.clearError,
    clearCurrentCabana: state.clearCurrentCabana,
    reset: state.reset,
  }));
};