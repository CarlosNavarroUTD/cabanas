import React from 'react';

const ServiceDebugger = ({ servicios = [], isLoadingServices = false, selectedServices = [] }) => {
  const loadingStatusClass = isLoadingServices ? "text-yellow-500" : "text-green-500";
  const loadingStatusText = isLoadingServices ? "Cargando..." : "Completado";

  return (
    <div className="border border-gray-300 rounded shadow-sm p-4 mb-4 bg-white">
      {/* Título */}
      <h2 className="text-lg font-bold mb-4">Estado de Servicios</h2>

      <div className="space-y-2">
        {/* Estado de carga */}
        <div className="flex items-center space-x-2">
          <span className="font-bold">Estado de carga:</span>
          <span className={loadingStatusClass}>{loadingStatusText}</span>
        </div>

        {/* Cantidad de servicios */}
        <div>
          <span className="font-bold">Cantidad de servicios:</span>
          <span className="ml-2">{servicios.length}</span>
        </div>

        {/* Servicios seleccionados */}
        <div>
          <span className="font-bold">Servicios seleccionados:</span>
          <span className="ml-2">{selectedServices.length}</span>
        </div>

        {/* Datos de servicios (si existen) */}
        {servicios.length > 0 && (
          <div>
            <div className="font-bold mb-2">Datos de servicios:</div>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto max-h-40">
              {JSON.stringify(servicios, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDebugger;
