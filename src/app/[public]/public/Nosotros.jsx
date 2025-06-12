export default function Nosotros() {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="py-20 bg-primary text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Sobre Nosotros</h1>
          <p className="text-xl">Conoce más sobre nuestra empresa y nuestros valores</p>
        </section>
  
        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Nuestra Filosofía
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard
                title="Misión"
                description="Brindar a nuestros clientes una experiencia inolvidable a través de un servicio confiable de rentas de cabañas, con actividades adicionales. Nos enfocamos en ofrecer un espacio de descanso que inspire confianza y satisfacción a nuestros huéspedes."
              />
              <FeatureCard
                title="Visión"
                description="Convertirnos en una de las empresas más reconocidas en el sector de rentas de cabañas, destacando por la calidad de nuestros servicios, la atención al cliente, y nuestro compromiso con la comodidad, la confianza de nuestros clientes y que esté al alcance de cualquier usuario."
              />
            </div>
          </div>
        </section>
      </div>
    );
  }
// Componente auxiliar para las tarjetas de características
function FeatureCard({ title, description }) {
    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full flex flex-col">
        <div className="bg-primary-dark py-4 px-6 flex-grow flex items-center justify-center">
          <h3 className="text-2xl font-semibold text-white text-center">{title}</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-700">{description}</p>
        </div>
      </div>
    );
  }