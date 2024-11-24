import { FaFacebookF, FaMapMarkerAlt, FaPhone } from 'react-icons/fa'
import logoImage from '../assets/imgs/logo.png';

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center mb-8">
          <img
            src={logoImage}
            alt="Cabañas Mexiquillo Logo"
            className="h-20 mb-4"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Dirección</h2>
            <a 
              href="https://goo.gl/maps/J82NxSLwvZAQhGNUA" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start hover:text-blue-400 transition duration-300"
            >
              <FaMapMarkerAlt className="mr-2 mt-1 flex-shrink-0" />
              <span>Carretera Durango-Mazatlan km 147 + 1 de terraceria. Poblado La Ciudad Pueblo Nuevo Durango.</span>
            </a>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Contacto</h2>
            <p className="flex items-center">
              <FaPhone className="mr-2" />
              <a href="tel:6691016030" className="hover:underline">669 101 6030</a>
            </p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Síguenos</h2>
            <a 
              href="https://www.facebook.com/mexiquillovdc?mibextid=ZbWKwL" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center hover:text-blue-400 transition duration-300"
            >
              <FaFacebookF className="mr-2" />
              <span>Facebook</span>
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Cabañas Mexiquillo. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  )
}