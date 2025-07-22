// app/components/Footer.tsx o src/components/Footer.tsx
import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-br from-olive-700 to-olive-900 text-beige-light py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 flex-wrap">
          
          {/* Lado izquierdo */}
          <div className="flex flex-col gap-4 items-start">
            <Image src="/logo.png" alt="Logo" width={120} height={60} />
            <p className="text-beige-light text-sm md:text-base">
              Nuestra misión es ofrecer experiencias inolvidables <br />
              en cabañas rodeadas de naturaleza.
            </p>
          </div>

          {/* Lado derecho */}
          <div className="flex flex-col gap-4 items-start">
            <h3 className="text-lg font-semibold text-beige-light">Información</h3>
            <p className="text-beige-light text-sm">Sierra Madre, Zona EcoTurística, México</p>
            <nav className="flex flex-wrap gap-4 mt-4 font-medium">
              <Link href="/" className="hover:text-white transition">Inicio</Link>
              <Link href="/cabanas" className="hover:text-white transition">Cabañas</Link>
              <Link href="/nosotros" className="hover:text-white transition">Sobre Nosotros</Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-beige-light/30 text-center">
          <p className="text-sm text-beige-light">
            © {new Date().getFullYear()} Cabañas Naturaleza. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
