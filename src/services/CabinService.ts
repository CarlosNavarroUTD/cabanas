// services/CabinService.ts
import axios from 'axios';

const API_URL = '/api/cabins';

export default {
  getAll: () => axios.get(API_URL),
  create: (data) => axios.post(API_URL, data),
  update: (id, data) => axios.put(`${API_URL}/${id}`, data),
  remove: (id) => axios.delete(`${API_URL}/${id}`),
};
