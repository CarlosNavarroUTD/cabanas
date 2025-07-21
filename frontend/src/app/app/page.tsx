export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard de Administración</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { fecha: '2025-07-18 10:12', accion: 'Login exitoso', usuario: 'admin', estado: '✅' },
              { fecha: '2025-07-18 09:50', accion: 'Eliminó cabaña ID #32', usuario: 'admin', estado: '⚠️' },
              { fecha: '2025-07-18 09:20', accion: 'Nuevo cliente registrado', usuario: 'juan_p', estado: '🆕' },
            ].map((evento, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{evento.fecha}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.accion}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.usuario}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{evento.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
