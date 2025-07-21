export default function Reservas() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Reservas</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cabaña</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Entrada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Salida</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              {
                cliente: 'Juan Pérez',
                cabana: 'Encino Rojo',
                entrada: '2025-07-20',
                salida: '2025-07-22',
                estado: 'Confirmada',
                total: '$3,200',
              },
              {
                cliente: 'Ana Gómez',
                cabana: 'Lago Azul',
                entrada: '2025-07-25',
                salida: '2025-07-28',
                estado: 'Pendiente',
                total: '$4,500',
              },
              {
                cliente: 'Carlos Méndez',
                cabana: 'Bosque Alto',
                entrada: '2025-07-18',
                salida: '2025-07-19',
                estado: 'Cancelada',
                total: '$0',
              },
            ].map((reserva, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{reserva.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reserva.cabana}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reserva.entrada}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{reserva.salida}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    className={`inline-flex px-2 py-1 rounded text-xs font-semibold ${
                      reserva.estado === 'Confirmada'
                        ? 'bg-green-100 text-green-800'
                        : reserva.estado === 'Pendiente'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {reserva.estado}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{reserva.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
