import React, { useState, useEffect } from 'react';
import { Pencil, Trash2, PlusCircle, RefreshCw } from 'lucide-react';

// Simulated service (in a real app, this would be an actual API service)
const PackageService = {
  getPackages: async () => {
    // Simulating an API call with additional data for activities and cabins
    return {
      results: [
        {
          id: 1,
          nombre: 'Paquete 1',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Tirolesa' },
            { nombre: 'Paseo en camioneta' },
            { nombre: 'Paseo libre en kayak' },
            { nombre: 'Entrada al parque' }
          ],
          cabanas: [
            { nombre: 'Sin cabaña ' },
          ],
          precio_base: 1700.00,
          noches: 0,
          cantidad_personas: 1,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 1'
        },
        {
          id: 2,
          nombre: 'Paquete 2',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Tirolesa' },
            { nombre: 'Paseo libre en kayak' },
            { nombre: 'Entrada al parque' }
          ],
          cabanas: [
            { nombre: 'Sin cabaña ' },
          ],
          precio_base: 2200.00,
          noches: 0,
          cantidad_personas: 1,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 1'
        },
        {
          id: 3,
          nombre: 'Paquete 3',
          actividades: [
            { nombre: 'Tirolesa con arco' },
            { nombre: 'Tirolesa' },
            { nombre: 'Paseo en camioneta' },
            { nombre: 'Paseo libre en kayak' },
            { nombre: 'Entrada al parque' }
          ],
          cabanas: [
            { nombre: 'Sin cabaña ' },
          ],
          precio_base: 1000.00,
          noches: 0,
          cantidad_personas: 1,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 1'
        },
        {
          id: 4,
          nombre: 'Paquete 4',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Lago de piedra' },
            { nombre: 'Jardin de piedra' },
            { nombre: 'Cascada de mexiquillo' },
            { nombre: 'Mirador tuneles' },
            { nombre: 'Tuneles y cascada' },
            { nombre: 'Mirador tuneles' }
          ],
          cabanas: [
            { nombre: 'Pinabete' },
          ],
          precio_base: 3100.00,
          noches: 1,
          cantidad_personas: 2,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 1'
        },
        {
          id: 5,
          nombre: 'Paquete 5',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Tirolesa' },
            { nombre: 'Paseo en camioneta' },
            { nombre: 'Entrada al parque' }
          ],
          cabanas: [
            { nombre: 'Pinabete ' },
          ],
          precio_base: 4000.00,
          noches: 1,
          cantidad_personas: 2,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 1'
        },
        {
          id: 6,
          nombre: 'Paquete 6',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Tirolesa' },
           
          ],
          cabanas: [
            { nombre: 'Pinabete ' },
          ],
          precio_base: 3300.00,
          noches: 1,
          cantidad_personas: 2,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 1'
        },

        {
          id: 7,
          nombre: 'Paquete 7',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Paseo libre en kayak' },
            { nombre: 'Entrada al parque' }
          ],
          cabanas: [
            { nombre: 'Pinabe' },
          ],
          precio_base: 3300.00,
          noches: 1,
          cantidad_personas: 2,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 2'
        },

        {
          id: 8,
          nombre: 'Paquete vip',
          actividades: [
            { nombre: 'Recorrido en cuatrimoto' },
            { nombre: 'Tirolesa' },
            { nombre: 'Tiro de arco' },
            { nombre: 'Paseo libre en kayak' }
            
          ],
          cabanas: [
            { nombre: 'Sin cabaña' }
          ],
          precio_base: 3200.00,
          noches: 0,
          cantidad_personas: 1,  // Nueva propiedad de cantidad de personas
          arrendador: 'Arrendador 2'
        }
      ]
    };
  },
  
        
  deletePackage: async (id) => {
    console.log(`Paquete ${id} eliminado`);
    return true;
  }
};

export default function ManagePackages() {
  const [paquetes, setPaquetes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const paquetesData = await PackageService.getPackages();
        setPaquetes(paquetesData.results || []);
  
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

  const handleDelete = async (id) => {
    try {
      await PackageService.deletePackage(id);
      setPaquetes(prevPaquetes => prevPaquetes.filter(paquete => paquete.id !== id));
    } catch (err) {
      console.error('Error deleting package:', err);
      setError('No se pudo eliminar el paquete. Por favor, intente de nuevo.');
    }
  };

  const handleEdit = (id) => {
    console.log(`Editar paquete con ID: ${id}`);
  };

  const handleAdd = () => {
    console.log('Añadir nuevo paquete');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin text-blue-500" size={32} />
        <span className="ml-2">Cargando paquetes...</span>
      </div>
    );
  }

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
          className="bg-primary-dark hover:bg-primary text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out flex items-center"
        >
          <PlusCircle className="mr-2" size={20} />
          Añadir Paquete
        </button>
      </div>

      {paquetes.length === 0 ? (
        <div className="text-center text-gray-500">
          No hay paquetes disponibles
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Nombre del paquete</th>
                <th className="py-3 px-6 text-left">Cabañas</th>
                <th className="py-3 px-6 text-left">Actividades</th>
                <th className="py-3 px-6 text-left">Precio base</th>
                <th className="py-3 px-6 text-left">Número de noches</th>
                <th className="py-3 px-6 text-left">Cantidad de personas</th> {/* Nueva columna */}
                <th className="py-3 px-6 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {paquetes.map((paquete) => (
                <tr
                  key={paquete.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition duration-300 ease-in-out"
                >
                  <td className="py-4 px-6 text-left whitespace-nowrap">
                    <span className="font-medium">{paquete.nombre}</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="text-sm text-gray-600">
                      {paquete.cabanas.map((cabaña, index) => (
                        <div key={index}>{cabaña.nombre}</div>
                      ))}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="text-sm text-gray-600">
                      {paquete.actividades.map((actividad, index) => (
                        <div key={index}>{actividad.nombre}</div>
                      ))}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="text-black py-1 px-3 rounded-full text-xs">
                      ${Number(paquete.precio_base).toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="text-black py-1 px-3 rounded-full text-xs">
                      {paquete.noches} noches
                    </span>
                  </td>
                  <td className="py-4 px-6 text-left"> {/* Nueva celda para cantidad de personas */}
                    <span className="text-black py-1 px-3 rounded-full text-xs">
                      {paquete.cantidad_personas} personas
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex item-center justify-center">
                      <button
                        onClick={() => handleEdit(paquete.id)}
                        className="text-blue-500 hover:text-blue-700 mx-2 transition duration-300 ease-in-out"
                        aria-label="Editar"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(paquete.id)}
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
