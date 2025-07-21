export default function Resenas() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Reseñas</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cabaña</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comentario</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Calificación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              {
                cliente: 'Juan Pérez',
                cabana: 'Encino Rojo',
                comentario: 'Muy cómoda y limpia, excelente ubicación.',
                calificacion: 5,
                fecha: '2025-07-15',
              },
              {
                cliente: 'Ana Gómez',
                cabana: 'Lago Azul',
                comentario: 'Bonita vista pero el WiFi falló un poco.',
                calificacion: 3,
                fecha: '2025-07-12',
              },
              {
                cliente: 'Carlos Méndez',
                cabana: 'Bosque Alto',
                comentario: 'El servicio fue lento y la cabaña estaba fría.',
                calificacion: 2,
                fecha: '2025-07-10',
              },
            ].map((resena, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{resena.cliente}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{resena.cabana}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 max-w-xs truncate" title={resena.comentario}>
                  {resena.comentario}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500">
                  {'★'.repeat(resena.calificacion)}{'☆'.repeat(5 - resena.calificacion)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{resena.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
