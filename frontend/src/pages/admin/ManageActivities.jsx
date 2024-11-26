  import React, { useState, useEffect } from 'react';
  import { Pencil, Trash2, PlusCircle, RefreshCw } from 'lucide-react';
  import ActivityService from '../../services/api/ActivityService'; // Adjust the import path as needed

  export default function ManageActivities() {
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch activities when component mounts
    useEffect(() => {
      const fetchActivities = async () => {
        try {
          setIsLoading(true);
          
          // Fetch activities
          const activitiesData = await ActivityService.getActivities();
          setActivities(activitiesData.results || []); // Extract results array
    
          setError(null);
        } catch (err) {
          console.error('Error fetching activities:', err);
          setError('No se pudo cargar la información. Por favor, intente de nuevo.');
        } finally {
          setIsLoading(false);
        }
      };
    
      fetchActivities();
    }, []);

    // Handle delete activity
    const handleDelete = async (id) => {
      try {
        await ActivityService.deleteActivity(id);
        // Remove the deleted activity from the state
        setActivities(prevActivities => prevActivities.filter(activity => activity.id !== id));
      } catch (err) {
        console.error('Error deleting activity:', err);
        setError('No se pudo eliminar la actividad. Por favor, intente de nuevo.');
      }
    };

    // Handle edit activity (placeholder)
    const handleEdit = (id) => {
      // TODO: Implement edit functionality
      console.log(`Editar actividad con ID: ${id}`);
    };

    // Handle add new activity (placeholder)
    const handleAdd = () => {
      // TODO: Implement add new activity functionality
      console.log('Añadir nueva actividad');
    };

    // Render loading state
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="animate-spin text-blue-500" size={32} />
          <span className="ml-2">Cargando actividades...</span>
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
            Añadir Actividad
          </button>
        </div>

        {activities.length === 0 ? (
          <div className="text-center text-gray-500">
            No hay actividades disponibles
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Nombre</th>
                  <th className="py-3 px-6 text-left">Descripción</th>
                  <th className="py-3 px-6 text-left">Costo</th>
                  <th className="py-3 px-6 text-left">Duración</th>
                  <th className="py-3 px-6 text-left">Ubicación</th>
                  <th className="py-3 px-6 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {activities.map((activity) => (
                  <tr
                    key={activity.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition duration-300 ease-in-out"
                  >
                    <td className="py-4 px-6 text-left whitespace-nowrap">
                      <span className="font-medium">{activity.name}</span>
                    </td>
                    <td className="py-4 px-6 text-left">{activity.description}</td>
                    <td className="py-4 px-6 text-left">
                      <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                        ${Number(activity.cost).toFixed(2)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                        {activity.duration} hrs
                      </span>
                    </td>
                    <td className="py-4 px-6 text-left">
                      <span className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-xs">
                        {activity.location || 'No especificada'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex item-center justify-center">
                        <button
                          onClick={() => handleEdit(activity.id)}
                          className="text-blue-500 hover:text-blue-700 mx-2 transition duration-300 ease-in-out"
                          aria-label="Editar"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(activity.id)}
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