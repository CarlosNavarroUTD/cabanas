'use client';

import { useState, useEffect } from 'react';
import { useTeamContext } from '@/contexts/TeamContext';
import { ReservationService } from '@/services/reservations.service';
import { TeamReservationResponse } from '@/types/reservationTypes';
import { Calendar, User, MapPin, DollarSign, Filter, RefreshCw } from 'lucide-react';

// Función helper para formatear fechas
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Función helper para formatear precio
const formatPrice = (price: string) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(parseFloat(price));
};

// Función helper para obtener el color del estado
const getStatusColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'confirmada':
      return 'bg-green-100 text-green-800';
    case 'pendiente':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelada':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Función helper para traducir el estado
const translateStatus = (estado: string) => {
  switch (estado.toLowerCase()) {
    case 'pendiente':
      return 'Pendiente';
    case 'confirmada':
      return 'Confirmada';
    case 'cancelada':
      return 'Cancelada';
    default:
      return estado;
  }
};

export default function ReservasPage() {
  const { currentTeam } = useTeamContext();
  const [reservas, setReservas] = useState<TeamReservationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('todas');

  // Cargar reservas del equipo actual
  const fetchReservas = async () => {
    if (!currentTeam) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await ReservationService.getReservationsByTeam(currentTeam.id);
      setReservas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las reservas');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [currentTeam]);

  // Filtrar reservas por estado
  const filteredReservas = filterStatus === 'todas' 
    ? reservas 
    : reservas.filter(reserva => reserva.estado.toLowerCase() === filterStatus.toLowerCase());

  // Estados únicos para el filtro
  const uniqueStatuses = Array.from(new Set(reservas.map(r => r.estado.toLowerCase())));

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-48 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error al cargar las reservas
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={fetchReservas}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Reservas</h1>
          {currentTeam && (
            <p className="text-gray-600">
              Reservas del equipo: <span className="font-medium">{currentTeam.name}</span>
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-4 mt-4 sm:mt-0">
          {/* Filtro por estado */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todas">Todas</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>
                  {translateStatus(status)}
                </option>
              ))}
            </select>
          </div>

          {/* Botón de actualizar */}
          <button
            onClick={fetchReservas}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Reservas</p>
              <p className="text-2xl font-semibold text-gray-900">{reservas.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <User className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Confirmadas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reservas.filter(r => r.estado.toLowerCase() === 'confirmada').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <MapPin className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {reservas.filter(r => r.estado.toLowerCase() === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ingresos Totales</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatPrice(
                  reservas
                    .filter(r => r.estado.toLowerCase() !== 'cancelada')
                    .reduce((sum, r) => sum + parseFloat(r.precio_final), 0)
                    .toString()
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de reservas */}
      {filteredReservas.length === 0 ? (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filterStatus === 'todas' ? 'No hay reservas' : `No hay reservas ${translateStatus(filterStatus).toLowerCase()}`}
          </h3>
          <p className="text-gray-500">
            {filterStatus === 'todas' 
              ? 'Aún no se han registrado reservas para este equipo.'
              : `No se encontraron reservas con estado ${translateStatus(filterStatus).toLowerCase()}.`
            }
          </p>
          {filterStatus !== 'todas' && (
            <button
              onClick={() => setFilterStatus('todas')}
              className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
            >
              Ver todas las reservas
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Salida
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReservas.map((reserva) => (
                  <tr key={reserva.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{reserva.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Cliente #{reserva.cliente}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(reserva.fecha_inicio)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(reserva.fecha_fin)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(reserva.estado)}`}>
                        {translateStatus(reserva.estado)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(reserva.precio_final)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Información adicional */}
      {filteredReservas.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Mostrando {filteredReservas.length} de {reservas.length} reservas
          {filterStatus !== 'todas' && ` (filtradas por: ${translateStatus(filterStatus)})`}
        </div>
      )}
    </div>
  );
}