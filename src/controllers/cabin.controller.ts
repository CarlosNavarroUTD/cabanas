// controllers/Cabin.controller.ts
import CabinService from '@/services/CabinService';

export const fetchCabins = async () => {
  try {
    const response = await CabinService.getAll();
    return response.data;
  } catch (err) {
    console.error('Error al obtener cabañas:', err);
    return [];
  }
};
