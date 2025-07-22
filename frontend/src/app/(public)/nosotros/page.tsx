export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative  text-white">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-[#2e3b1f]">
              Sobre Nosotros
            </h1>
            <p className="text-xl md:text-2xl text-[#2e3b1f] max-w-3xl mx-auto">
              Conectando la naturaleza con experiencias inolvidables en el corazón de Durango
            </p>
          </div>
        </div>

      </div>

      {/* Misión y Visión */}
      <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Misión */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nuestra Misión</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Proporcionar experiencias únicas en la naturaleza del Parque Natural Mexiquillo,
              promoviendo el turismo sustentable y la conservación del medio ambiente, mientras
              creamos memorias inolvidables para nuestros visitantes a través de servicios de
              calidad excepcional.
            </p>
          </div>

          {/* Visión */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Nuestra Visión</h2>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Ser el destino líder de ecoturismo en la región de Durango, reconocidos por
              nuestra excelencia en el servicio, compromiso con la sostenibilidad y por ser
              el puente perfecto entre los visitantes y las maravillas naturales de Mexiquillo.
            </p>
          </div>
        </div>
      </div>



      {/* Mapa de Ubicación */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Encuéntranos</h2>
          <p className="text-lg text-gray-600">Ubicados en el hermoso Parque Natural Mexiquillo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.7392296868543!2d-105.6788205!3d23.7210046!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x869922422ca2aac3%3A0xf79e5263228e7410!2sParque%20Natural%20Mexiquillo!5e0!3m2!1ses!2smx!4v1753159075975!5m2!1ses!2smx"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>
      </div>

      {/* Estadísticas */}
      <div className="bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5+</div>
              <div className="text-blue-100">Años de Experiencia</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10k+</div>
              <div className="text-blue-100">Visitantes Satisfechos</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-blue-100">Actividades Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Recomendación</div>
            </div>
          </div>
        </div>
      </div>

      {/* Valores */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestros Valores</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Los principios que guían cada una de nuestras acciones</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Sustentabilidad</h3>
              <p className="text-gray-600">Protegemos y preservamos el entorno natural para futuras generaciones</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Excelencia</h3>
              <p className="text-gray-600">Nos comprometemos con la calidad en cada servicio que ofrecemos</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Comunidad</h3>
              <p className="text-gray-600">Apoyamos y fortalecemos las comunidades locales</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-[#2E3B1F] via-[#556B2F] via-[#8B5E3C] to-[#4E3620] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Innovación</h3>
              <p className="text-gray-600">Buscamos constantemente nuevas formas de mejorar la experiencia</p>
            </div>
          </div>
        </div>
      </div>


      {/* Logos de Partners/Certificaciones */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center justify-items-center">
            <img
              src="/utd.png"
              alt="Partner 1"
              className="max-h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="/eabmodel.jpeg"
              alt="Partner 2"
              className="max-h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
            <img
              src="/tics.png"
              alt="Partner 3"
              className="max-h-32 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      {/* Contacto Rápido 
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">¿Listo para tu próxima aventura?</h2>
          <p className="text-xl text-gray-300 mb-8">Contáctanos y planifiquemos juntos tu experiencia perfecta en Mexiquillo</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Contáctanos
            </button>
            <button className="border border-gray-400 text-gray-300 hover:text-white hover:border-white px-8 py-3 rounded-lg font-semibold transition-all duration-300">
              Ver Paquetes
            </button>
          </div>
        </div>
      </div>
        */}
    </div>
  );
}