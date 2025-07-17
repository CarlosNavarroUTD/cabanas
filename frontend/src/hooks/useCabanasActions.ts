// src/hooks/useCabanasActions.ts
import { useCallback } from 'react';
import { useCabanas } from './useCabanas';

export const useCabanasActions = () => {
  const {
    fetchCabanas,
    fetchCabanaDetail,
    fetchMyCabanas,
    createCabana,
    updateCabana,
    deleteCabana,
    fetchServicios,
    checkDisponibilidad,
    fetchImagenes,
    agregarImagen,
    updateImagen,
    deleteImagen,
    fetchResenas,
    agregarResena,
    updateResena,
    deleteResena,
    setFilters,
    clearFilters,
    clearError,
    clearCurrentCabana,
    reset,
  } = useCabanas();

  // Memoizar funciones con useCallback
  return {
    fetchCabanas: useCallback(fetchCabanas, []),
    fetchCabanaDetail: useCallback(fetchCabanaDetail, []),
    fetchMyCabanas: useCallback(fetchMyCabanas, []),
    createCabana: useCallback(createCabana, []),
    updateCabana: useCallback(updateCabana, []),
    deleteCabana: useCallback(deleteCabana, []),
    fetchServicios: useCallback(fetchServicios, []),
    checkDisponibilidad: useCallback(checkDisponibilidad, []),
    fetchImagenes: useCallback(fetchImagenes, []),
    agregarImagen: useCallback(agregarImagen, []),
    updateImagen: useCallback(updateImagen, []),
    deleteImagen: useCallback(deleteImagen, []),
    fetchResenas: useCallback(fetchResenas, []),
    agregarResena: useCallback(agregarResena, []),
    updateResena: useCallback(updateResena, []),
    deleteResena: useCallback(deleteResena, []),
    setFilters: useCallback(setFilters, []),
    clearFilters: useCallback(clearFilters, []),
    clearError: useCallback(clearError, []),
    clearCurrentCabana: useCallback(clearCurrentCabana, []),
    reset: useCallback(reset, []),
  };
};
