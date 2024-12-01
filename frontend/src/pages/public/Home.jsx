import { Link } from 'react-router-dom';
import heroImage from '../../assets/imgs/banner.jpg';
import GoogleMap from '../../components/GoogleMap';
import Logo from '../../assets/imgs/logo.png';


export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Hero background"
            className="w-full h-full object-cover opacity-50"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 flex flex-col justify-center items-center">
        <img src={Logo} alt="Logo" className="w-52 h-52 mb-8" />
          <div className="max-w-3xl text-center">
            <h1 className="text-4xl font-bold mb-4">
              Cabañas Mexiquillo
            </h1>
            <p className="text-xl mb-8">
              Descubre nuevas cabañas con nosotros, lo mejor te espera.
            </p>
            <Link
              to="/nosotros"
              className="bg-primary-dark text-light px-6 py-3 rounded-lg font-medium hover:bg-primary transition duration-300"
            >
              Conócenos
            </Link>
          </div>
        </div>
      </section> 
      <section>
        <div>
          <GoogleMap />
        </div>
      </section>
    </div>
  );
}