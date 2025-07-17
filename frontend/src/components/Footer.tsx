import Link from "next/link";


export default function Footer() {
        return (
        <footer className="bg-gray-800">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                <h3 className="text-white text-lg font-semibold mb-4">Sobre Nosotros</h3>
                <p className="text-gray-300">
                    Breve descripción de la empresa o proyecto.
                </p>
                </div>
                <div>
                <h3 className="text-white text-lg font-semibold mb-4">Enlaces Rápidos</h3>
                <ul className="space-y-2">
                    <li>
                    <Link href="/" className="text-gray-300 hover:text-white">
                        Inicio
                    </Link>
                    </li>
                    <li>
                    <Link href="/about" className="text-gray-300 hover:text-white">
                        Nosotros
                    </Link>
                    </li>
                    <li>
                    <Link href="/contact" className="text-gray-300 hover:text-white">
                        Contacto
                    </Link>
                    </li>
                </ul>
                </div>
                <div>
                <h3 className="text-white text-lg font-semibold mb-4">Contacto</h3>
                <ul className="space-y-2 text-gray-300">
                    <li>Email: info@ejemplo.com</li>
                    <li>Teléfono: (123) 456-7890</li>
                    <li>Dirección: Calle Ejemplo #123</li>
                </ul>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700">
                <p className="text-center text-gray-300">
                © {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
                </p>
            </div>
            </div>
        </footer>
        );
    }
    