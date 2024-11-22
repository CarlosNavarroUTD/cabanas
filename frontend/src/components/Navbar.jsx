import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-primary-dark py-4">
      {/* ... */}
      <div className="ml-10 flex items-baseline space-x-4">
        <Link
          to="/"
          className={`${
            location.pathname === '/'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Home
        </Link>
        <Link
          to="/cabins"
          className={`${
            location.pathname.startsWith('/cabins')
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Cabañas
        </Link>
        <Link
          to="/login"
          className={`${
            location.pathname === '/login'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className={`${
            location.pathname === '/register'
              ? 'bg-gray-900 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          } px-3 py-2 rounded-md text-sm font-medium`}
        >
          Registrarse
        </Link>
      </div>
      {/* ... */}
    </nav>
  );
};

export default Navbar;
