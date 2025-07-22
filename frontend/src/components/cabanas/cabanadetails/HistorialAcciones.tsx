'use client';

import React, { useState, useEffect } from 'react';
import { User, Calendar, DollarSign, Edit3, Activity } from 'lucide-react';

interface ActionHistory {
  id: number;
  type: 'creacion' | 'edicion' | 'reserva' | 'pago';
  user: string;
  date: string;
  description: string;
}

interface HistorialAccionesProps {
  cabanaId: number;
}

export default function HistorialAcciones({ cabanaId }: HistorialAccionesProps) {
  const [historialAcciones, setHistorialAcciones] = useState<ActionHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistorialAcciones = async () => {
      setLoading(true);
      
      // Aquí harías la llamada a la API real
      // const response = await fetch(`/api/cabanas/${cabanaId}/historial`);
      // const data = await response.json();
      
      // Datos simulados por ahora
      const mockHistorial: ActionHistory[] = [
        {
          id: 1,
          type: 'creacion',
          user: 'María González',
          date: '2024-01-15 10:30:00',
          description: 'Cabaña creada en el sistema'
        },
        {
          id: 2,
          type: 'edicion',
          user: 'Carlos Ruiz',
          date: '2024-02-20 14:45:00',
          description: 'Actualizó descripción y servicios'
        },
        {
          id: 3,
          type: 'reserva',
          user: 'Ana Martínez',
          date: '2024-03-01 09:15:00',
          description: 'Reserva para 3 noches (01-03 Mar)'
        },
        {
          id: 4,
          type: 'pago',
          user: 'Ana Martínez',
          date: '2024-03-01 09:20:00',
          description: 'Pago confirmado - $450.00'
        },
        {
          id: 5,
          type: 'reserva',
          user: 'Roberto Silva',
          date: '2024-03-15 16:30:00',
          description: 'Reserva para 2 noches (15-17 Mar)'
        },
        {
          id: 6,
          type: 'pago',
          user: 'Roberto Silva',
          date: '2024-03-15 16:35:00',
          description: 'Pago confirmado - $300.00'
        }
      ];
      
      setHistorialAcciones(mockHistorial);
      setLoading(false);
    };

    loadHistorialAcciones();
  }, [cabanaId]);

  const getActionIcon = (type: ActionHistory['type']) => {
    switch (type) {
      case 'creacion': return <User className="h-4 w-4 text-green-600" />;
      case 'edicion': return <Edit3 className="h-4 w-4 text-blue-600" />;
      case 'reserva': return <Calendar className="h-4 w-4 text-purple-600" />;
      case 'pago': return <DollarSign className="h-4 w-4 text-emerald-600" />;
    }
  };

  const getActionColor = (type: ActionHistory['type']) => {
    switch (type) {
      case 'creacion': return 'bg-green-50 border-green-200';
      case 'edicion': return 'bg-blue-50 border-blue-200';
      case 'reserva': return 'bg-purple-50 border-purple-200';
      case 'pago': return 'bg-emerald-50 border-emerald-200';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Historial de Acciones
          </h2>
        </div>
        <div className="p-6 flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Historial de Acciones
        </h2>
      </div>
      
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-4">
          {historialAcciones.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No hay acciones registradas</p>
            </div>
          ) : (
            historialAcciones.map((accion) => (
              <div 
                key={accion.id}
                className={`p-4 rounded-lg border ${getActionColor(accion.type)}`}
              >
                <div className="flex items-start gap-3">
                  {getActionIcon(accion.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-gray-900">
                        {accion.user}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(accion.date).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600">{accion.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}