export default function Clientes() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Clientes</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 bg-white shadow rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registrado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[
              { nombre: 'Juan Pérez', correo: 'juan@example.com', telefono: '555-1234', fecha: '2025-07-01' },
              { nombre: 'Ana López', correo: 'ana@example.com', telefono: '555-5678', fecha: '2025-07-02' },
              { nombre: 'Carlos Ruiz', correo: 'carlos@example.com', telefono: '555-9876', fecha: '2025-07-03' },
            ].map((cliente, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{cliente.nombre}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.correo}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.telefono}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{cliente.fecha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
