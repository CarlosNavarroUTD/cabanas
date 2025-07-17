export default function Contact() {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Contacto</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-gray-700 mb-4">
              Información de contacto y formulario...
            </p>
            {/* Aquí puedes agregar un formulario de contacto */}
          </div>
          <div>
            {/* Aquí puedes agregar un mapa o información adicional */}
          </div>
        </div>
      </div>
    );
  }