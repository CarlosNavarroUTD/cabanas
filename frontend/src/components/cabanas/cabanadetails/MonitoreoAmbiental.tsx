'use client';

import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface TemperaturaData {
  hora: string;
  valor: number;
}

interface HumedadData {
  hora: string;
  valor: number;
}

interface MonitoreoAmbientalProps {
  cabanaId: number;
}

export default function MonitoreoAmbiental({ cabanaId }: MonitoreoAmbientalProps) {
  const [temperaturaData, setTemperaturaData] = useState<TemperaturaData[]>([]);
  const [humedadData, setHumedadData] = useState<HumedadData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMonitoreoData = async () => {
      setLoading(true);
      
      // Aquí harías las llamadas a la API real
      // const tempResponse = await fetch(`/api/cabanas/${cabanaId}/temperatura`);
      // const humResponse = await fetch(`/api/cabanas/${cabanaId}/humedad`);
      // const tempData = await tempResponse.json();
      // const humData = await humResponse.json();
      
      // Datos simulados por ahora
      const mockTemperaturaData: TemperaturaData[] = [
        { hora: '00:00', valor: 22 },
        { hora: '04:00', valor: 20 },
        { hora: '08:00', valor: 24 },
        { hora: '12:00', valor: 28 },
        { hora: '16:00', valor: 30 },
        { hora: '20:00', valor: 26 },
        { hora: '23:59', valor: 23 }
      ];

      const mockHumedadData: HumedadData[] = [
        { hora: '00:00', valor: 65 },
        { hora: '04:00', valor: 70 },
        { hora: '08:00', valor: 60 },
        { hora: '12:00', valor: 55 },
        { hora: '16:00', valor: 50 },
        { hora: '20:00', valor: 58 },
        { hora: '23:59', valor: 62 }
      ];
      
      setTemperaturaData(mockTemperaturaData);
      setHumedadData(mockHumedadData);
      setLoading(false);
    };

    loadMonitoreoData();
  }, [cabanaId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Thermometer className="h-5 w-5" />
            Monitoreo Ambiental
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
          <Thermometer className="h-5 w-5" />
          Monitoreo Ambiental
        </h2>
      </div>
      
      <div className="p-6 space-y-8 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Temperatura */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <h3 className="text-lg font-medium text-gray-900">Temperatura</h3>
            <span className="ml-auto text-2xl font-bold text-orange-600">
              {temperaturaData.length > 0 ? temperaturaData[temperaturaData.length - 1].valor : 0}°C
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={temperaturaData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                <Tooltip 
                  formatter={(value: number) => [`${value}°C`, 'Temperatura']}
                  labelFormatter={(label: string) => `Hora: ${label}`}
                />
                <Area 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#f97316" 
                  fill="#fed7aa" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humedad */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="h-4 w-4 text-blue-500" />
            <h3 className="text-lg font-medium text-gray-900">Humedad</h3>
            <span className="ml-auto text-2xl font-bold text-blue-600">
              {humedadData.length > 0 ? humedadData[humedadData.length - 1].valor : 0}%
            </span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={humedadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hora" />
                <YAxis domain={[40, 80]} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Humedad']}
                  labelFormatter={(label: string) => `Hora: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indicadores de estado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-center">
              <p className="text-sm font-medium text-green-800">Estado General</p>
              <p className="text-lg font-bold text-green-600">Óptimo</p>
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-800">Última Lectura</p>
              <p className="text-lg font-bold text-blue-600">Hace 5 min</p>
            </div>
          </div>
        </div>

        {/* Alertas o notificaciones si las hay */}
        <div className="space-y-2">
          <h4 className="text-md font-medium text-gray-900">Alertas del Sistema</h4>
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-800">
              <span className="font-medium">Información:</span> Todos los sensores funcionando correctamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}