import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, PlusCircle, RefreshCw } from 'lucide-react';
import CabinService from '../../services/api/CabinService'; // Adjust the import path as needed

export default function ManageCabins() {
  const [cabanas, setCabanas] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cabins and locations when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch cabins
        const cabinasData = await CabinService.getCabins();
        setCabanas(cabinasData.results || []); // Extraemos el array results
  
        // Fetch locations
        const ubicacionesData = await CabinService.getUbicaciones();
        setUbicaciones(ubicacionesData.results || []);
  
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('No se pudo cargar la información. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Handle delete cabin
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de que quieres eliminar esta cabaña?');
    
    if (!confirmDelete) return;
  
    try {
      await CabinService.deleteCabin(id);
      setCabanas(prevCabanas => prevCabanas.filter(cabana => cabana.id !== id));
      
      // Optional: Add success notification
      alert('Cabaña eliminada exitosamente');
    } catch (err) {
      console.error('Detailed delete error:', err);
      console.error('Error response:', err.response);
      
      const errorMessage = err.response?.data?.detail || 
                           err.message || 
                           'No se pudo eliminar la cabaña';
      
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  // Handle edit cabin (placeholder)
  const handleEdit = (id) => {
    // TODO: Implement edit functionality
    console.log(`Editar cabaña con ID: ${id}`);
  };

  // Handle add new cabin (placeholder)
  const handleAdd = () => {
    // TODO: Implement add new cabin functionality
    console.log('Añadir nueva cabaña');
  };

  // Find location name by ID
  const getUbicacionName = (ubicacionNombre) => {
    return ubicacionNombre || 'Ubicación no especificada';
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-2">Cargando cabañas...</span>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
        <button
          onClick={() => window.location.reload()}
          className="absolute top-0 bottom-0 right-0 px-4 py-3 text-blue-500 hover:text-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={handleAdd}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
        >
          <PlusCircle className="mr-2" size={20} />
          Añadir Cabaña
        </button>
      </div>

      {cabanas.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay cabañas disponibles
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Ubicación</th>
                <th className="py-3 px-6 text-left">Precio por Noche</th>
                <th className="py-3 px-6 text-left">Capacidad</th>
                <th className="py-3 px-6 text-left">Estado</th>
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {cabanas.map((cabana) => (
                <tr
                  key={cabana.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-300 ease-in-out"
                >
                  <td className="py-4 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{cabana.nombre}</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs">
                      {getUbicacionName(cabana.ubicacion_nombre)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                      ${Number(cabana.costo_por_noche).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                      {Number(cabana.capacidad)} personas
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className={`
                      py-1 px-3 rounded-full text-xs 
                      ${cabana.estado === 'disponible' ? 'bg-green-100 text-green-800' :
                        cabana.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
                          cabana.estado === 'mantenimiento' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                      }
                    `}>
                      {cabana.estado}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleEdit(cabana.id)}
                        className="text-blue-500 hover:text-blue-700 mx-2 transition duration-300 ease-in-out"
                        aria-label="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(cabana.id)}
                        className="text-red-500 hover:text-red-700 mx-2 transition duration-300 ease-in-out"
                        aria-label="Borrar"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}