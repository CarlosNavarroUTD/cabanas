'use client';

import React, { useState } from 'react';
import { ArrowLeft, User, Calendar, DollarSign, Thermometer, Droplets, Activity, Edit3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Interfaces
interface Cabana {
  id: number;
  nombre: string;
  descripcion: string;
  capacidad: number;
  numero_habitaciones: number;
  numero_banos: number;
  costo_por_noche: number;
  permite_mascotas: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  imagen_principal?: string;
  calificacion_promedio: number;
  total_resenas: number;
  team_name: string;
  hora_checkin?: string;
  hora_checkout?: string;
  servicios: { id: number; nombre: string; descripcion: string; }[];
}

interface CabanaFormData {
  nombre: string;
  descripcion: string;
  capacidad: number;
  numero_habitaciones: number;
  numero_banos: number;
  costo_por_noche: number;
  permite_mascotas: boolean;
  estado: 'disponible' | 'ocupada' | 'mantenimiento';
  imagen_principal: string;
  hora_checkin: string;
  hora_checkout: string;
  servicios: number[];
  team_id: number;
}

interface ActionHistory {
  id: number;
  type: 'creacion' | 'edicion' | 'reserva' | 'pago';
  user: string;
  date: string;
  description: string;
}

// Componente del formulario (simplificado para el ejemplo)
const CabanaForm = ({ cabana, onSubmit, onCancel }: { 
  cabana?: Cabana | null; 
  onSubmit: (data: CabanaFormData) => void; 
  onCancel: () => void; 
}) => {
  const [formData, setFormData] = useState<CabanaFormData>({
    nombre: cabana?.nombre ?? 'Cabaña Vista al Lago',
    descripcion: cabana?.descripcion ?? 'Hermosa cabaña con vista panorámica al lago',
    capacidad: cabana?.capacidad ?? 4,
    numero_habitaciones: cabana?.numero_habitaciones ?? 2,
    numero_banos: cabana?.numero_banos ?? 1,
    costo_por_noche: cabana?.costo_por_noche ?? 150,
    permite_mascotas: cabana?.permite_mascotas ?? true,
    estado: cabana?.estado ?? 'disponible',
    imagen_principal: cabana?.imagen_principal ?? '',
    hora_checkin: cabana?.hora_checkin ?? '15:00',
    hora_checkout: cabana?.hora_checkout ?? '11:00',
    servicios: cabana?.servicios?.map(s => s.id) ?? [1, 2, 3],
    team_id: 1
  });

  const servicios = [
    { id: 1, nombre: 'WiFi', descripcion: 'Internet de alta velocidad' },
    { id: 2, nombre: 'Aire Acondicionado', descripcion: 'Climatización completa' },
    { id: 3, nombre: 'Cocina Equipada', descripcion: 'Cocina con todos los utensilios' },
    { id: 4, nombre: 'TV Cable', descripcion: 'Televisión por cable' },
    { id: 5, nombre: 'Estacionamiento', descripcion: 'Plaza de estacionamiento privada' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (type === 'number') {
      const numValue = value === '' ? 0 : parseFloat(value);
      setFormData(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value ?? ''
      }));
    }
  };

  const handleServicioToggle = (servicioId: number) => {
    setFormData(prev => ({
      ...prev,
      servicios: prev.servicios.includes(servicioId)
        ? prev.servicios.filter(id => id !== servicioId)
        : [...prev.servicios, servicioId]
    }));
  };

  //const handleSubmit = (e: React.FormEvent) => {
  //  e.preventDefault();
  //  onSubmit(formData);
  //};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Edit3 className="h-5 w-5" />
          {cabana ? 'Editar Cabaña' : 'Nueva Cabaña'}
        </h2>
      </div>
      
      <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        <div className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Información Básica</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  name="capacidad"
                  value={formData.capacidad}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Costo por Noche ($)
                </label>
                <input
                  type="number"
                  name="costo_por_noche"
                  value={formData.costo_por_noche}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Habitaciones
                </label>
                <input
                  type="number"
                  name="numero_habitaciones"
                  value={formData.numero_habitaciones}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Baños
                </label>
                <input
                  type="number"
                  name="numero_banos"
                  value={formData.numero_banos}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-in
                </label>
                <input
                  type="time"
                  name="hora_checkin"
                  value={formData.hora_checkin}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check-out
                </label>
                <input
                  type="time"
                  name="hora_checkout"
                  value={formData.hora_checkout}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="permite_mascotas"
                  checked={formData.permite_mascotas}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Permite mascotas</span>
              </label>
            </div>
          </div>

          {/* Servicios */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Servicios Incluidos</h3>
            <div className="space-y-2">
              {servicios.map(servicio => (
                <label key={servicio.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.servicios.includes(servicio.id)}
                    onChange={() => handleServicioToggle(servicio.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-700">{servicio.nombre}</span>
                    <p className="text-xs text-gray-500">{servicio.descripcion}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => onSubmit(formData)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
            >
              {cabana ? 'Actualizar Cabaña' : 'Crear Cabaña'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-md font-medium transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal
export default function CabanaDetailAdminPage() {
  // Datos simulados
  const [cabana] = useState<Cabana>({
    id: 1,
    nombre: 'Cabaña Vista al Lago',
    descripcion: 'Hermosa cabaña con vista panorámica al lago y todas las comodidades',
    capacidad: 4,
    numero_habitaciones: 2,
    numero_banos: 1,
    costo_por_noche: 150,
    permite_mascotas: true,
    estado: 'disponible',
    imagen_principal: '',
    calificacion_promedio: 4.8,
    total_resenas: 24,
    team_name: 'Equipo Lagos',
    hora_checkin: '15:00',
    hora_checkout: '11:00',
    servicios: [
      { id: 1, nombre: 'WiFi', descripcion: 'Internet de alta velocidad' },
      { id: 2, nombre: 'Aire Acondicionado', descripcion: 'Climatización completa' },
      { id: 3, nombre: 'Cocina Equipada', descripcion: 'Cocina con todos los utensilios' }
    ]
  });

  const [historialAcciones] = useState<ActionHistory[]>([
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
  ]);

  // Datos de monitoreo simulados
  const [temperaturaData] = useState([
    { hora: '00:00', valor: 22 },
    { hora: '04:00', valor: 20 },
    { hora: '08:00', valor: 24 },
    { hora: '12:00', valor: 28 },
    { hora: '16:00', valor: 30 },
    { hora: '20:00', valor: 26 },
    { hora: '23:59', valor: 23 }
  ]);

  const [humedadData] = useState([
    { hora: '00:00', valor: 65 },
    { hora: '04:00', valor: 70 },
    { hora: '08:00', valor: 60 },
    { hora: '12:00', valor: 55 },
    { hora: '16:00', valor: 50 },
    { hora: '20:00', valor: 58 },
    { hora: '23:59', valor: 62 }
  ]);

  const handleFormSubmit = (data: CabanaFormData) => {
    console.log('Datos del formulario:', data);
    // Aquí iría la lógica para actualizar la cabaña
  };

  const handleFormCancel = () => {
    console.log('Formulario cancelado');
    // Aquí iría la lógica para cancelar la edición
  };

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver a Cabañas</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">{cabana.nombre}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              cabana.estado === 'disponible' ? 'bg-green-100 text-green-800' :
              cabana.estado === 'ocupada' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {cabana.estado.charAt(0).toUpperCase() + cabana.estado.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Layout de 3 columnas */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Columna 1: Formulario */}
        <div className="w-1/3 p-6 overflow-hidden">
          <CabanaForm 
            cabana={cabana}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>

        {/* Columna 2: Historial de Acciones */}
        <div className="w-1/3 p-6 border-l border-gray-200">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Historial de Acciones
              </h2>
            </div>
            
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="space-y-4">
                {historialAcciones.map((accion) => (
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
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Columna 3: Monitoreo */}
        <div className="w-1/3 p-6 border-l border-gray-200">
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
                    {temperaturaData[temperaturaData.length - 1].valor}°C
                  </span>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={temperaturaData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                      <Tooltip 
                        formatter={(value:number) => [`${value}°C`, 'Temperatura']}
                        labelFormatter={(label:number) => `Hora: ${label}`}
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
                    {humedadData[humedadData.length - 1].valor}%
                  </span>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={humedadData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hora" />
                      <YAxis domain={[40, 80]} />
                      <Tooltip 
                        formatter={(value:number) => [`${value}%`, 'Humedad']}
                        labelFormatter={(label:number) => `Hora: ${label}`}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}