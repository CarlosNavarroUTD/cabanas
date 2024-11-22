import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();

  return (
    <nav className="bg-primary-dark py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/admin" className="text-white font-bold text-xl">
              Admin Panel
            </Link>
          </div>
          <div className="ml-10 flex items-baseline space-x-4">
            <Link
              to="/admin/"
              className={`${
                location.pathname === '/admin/'
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`${
                location.pathname === '/admin/users'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Users
            </Link>
            <Link
              to="/admin/cabins"
              className={`${
                location.pathname === '/admin/cabins'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Cabins
            </Link>
            <Link
              to="/admin/bookings"
              className={`${
                location.pathname === '/admin/bookings'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } px-3 py-2 rounded-md text-sm font-medium`}
            >
              Bookings
            </Link>
            <Link
              to="/logout"
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;