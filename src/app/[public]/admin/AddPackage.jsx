import React, { useState } from 'react';

// Datos de ejemplo
const cabanas = [
  { id: 1, nombre: "Cabaña del Bosque", descripcion: "Hermosa cabaña rodeada de árboles", capacidad: 4, costo_por_noche: 100 },
  { id: 2, nombre: "Cabaña del Lago", descripcion: "Cabaña con vista al lago", capacidad: 6, costo_por_noche: 150 },
  { id: 3, nombre: "Cabaña de la Montaña", descripcion: "Cabaña en lo alto de la montaña", capacidad: 2, costo_por_noche: 80 },
];

const actividades = [
  { id: 1, nombre: "Senderismo", descripcion: "Recorrido por senderos naturales", costo: 20 },
  { id: 2, nombre: "Kayak", descripcion: "Paseo en kayak por el lago", costo: 30 },
  { id: 3, nombre: "Observación de aves", descripcion: "Tour guiado de observación de aves", costo: 15 },
];

export default function PaqueteSelector() {
  const [cabanaSeleccionadas, setCabanaSeleccionadas] = useState([]);
  const [actividadesSeleccionadas, setActividadesSeleccionadas] = useState([]);
  const [noches, setNoches] = useState(1);

  const toggleCabana = (id) => {
    setCabanaSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(cabanId => cabanId !== id) : [...prev, id]
    );
  };

  const toggleActividad = (id) => {
    setActividadesSeleccionadas(prev => 
      prev.includes(id) ? prev.filter(actId => actId !== id) : [...prev, id]
    );
  };

  const calcularTotal = () => {
    const costoCabanas = cabanaSeleccionadas.reduce((total, id) => {
      const cabana = cabanas.find(c => c.id === id);
      return total + (cabana ? cabana.costo_por_noche * noches : 0);
    }, 0);

    const costoActividades = actividadesSeleccionadas.reduce((total, id) => {
      const actividad = actividades.find(a => a.id === id);
      return total + (actividad ? actividad.costo : 0);
    }, 0);

    return costoCabanas + costoActividades;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary-dark">Selecciona tu Paquete</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Cabañas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cabanas.map(cabana => (
            <div 
              key={cabana.id} 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                cabanaSeleccionadas.includes(cabana.id) 
                  ? 'bg-blue-100 border-blue-500' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => toggleCabana(cabana.id)}
            >
              <h3 className="font-bold text-lg mb-2">{cabana.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{cabana.descripcion}</p>
              <p className="text-sm">Capacidad: {cabana.capacidad} personas</p>
              <p className="font-semibold mt-2">${cabana.costo_por_noche}/noche</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Actividades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {actividades.map(actividad => (
            <div 
              key={actividad.id} 
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                actividadesSeleccionadas.includes(actividad.id) 
                  ? 'bg-green-100 border-green-500' 
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => toggleActividad(actividad.id)}
            >
              <h3 className="font-bold text-lg mb-2">{actividad.nombre}</h3>
              <p className="text-sm text-gray-600 mb-2">{actividad.descripcion}</p>
              <p className="font-semibold mt-2">${actividad.costo}/persona</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <label htmlFor="noches" className="block text-lg font-medium text-gray-700 mb-2">
          Número de noches:
        </label>
        <input
          type="number"
          id="noches"
          min="1"
          value={noches}
          onChange={(e) => setNoches(Math.max(1, parseInt(e.target.value)))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        />
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Resumen del Paquete</h2>
        <div className="mb-4">
          <h3 className="font-semibold">Cabañas seleccionadas:</h3>
          <ul className="list-disc list-inside">
            {cabanaSeleccionadas.map(id => (
              <li key={id}>{cabanas.find(c => c.id === id)?.nombre}</li>
            ))}
          </ul>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold">Actividades seleccionadas:</h3>
          <ul className="list-disc list-inside">
            {actividadesSeleccionadas.map(id => (
              <li key={id}>{actividades.find(a => a.id === id)?.nombre}</li>
            ))}
          </ul>
        </div>
        <p className="text-xl font-bold text-right">
          Total: ${calcularTotal()}
        </p>
      </div>

      <button 
        className="mt-6 w-full bg-primary-dark hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        Añadir Paquete
      </button>
    </div>
  );
}