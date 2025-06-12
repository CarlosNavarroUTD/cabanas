import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaHome, 
  FaHotel, 
  FaHiking, 
  FaBox, 
  FaCalendarAlt 
} from 'react-icons/fa';
import logoImage from '../assets/imgs/logo.png';

const Sidebar = () => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: FaHome, 
      link: '/admin',
      subItems: []
    },
    { 
      name: 'Cabañas', 
      icon: FaHotel, 
      link: '/admin/cabins',
      subItems: [
        { name: 'Administrar', link: '/admin/cabins' },
        { name: 'Añadir', link: '/admin/cabins/add' }
      ]
    },
    { 
      name: 'Actividades', 
      icon: FaHiking, 
      link: '/admin/actividades',
      subItems: [
        { name: 'Administrar', link: '/admin/actividades' },
        { name: 'Añadir', link: '/admin/actividades/anadir' }
      ]
    },
    { 
      name: 'Paquetes', 
      icon: FaBox, 
      link: '/admin/paquetes',
      subItems: [
        { name: 'Administrar', link: '/admin/paquetes' },
        { name: 'Añadir', link: '/admin/paquetes/anadir' }
      ]
    },
    { 
      name: 'Reservas', 
      icon: FaCalendarAlt, 
      link: '/admin/reservas',
      subItems: [
        { name: 'Administrar', link: '/admin/reservas' },
        { name: 'Añadir', link: '/admin/reservas/anadir' }
      ]
    }
  ];

  return (
    <div className="w-16 hover:w-64 bg-primary-dark transition-all duration-300 ease-in-out overflow-hidden group fixed left-0 top-0 bottom-0 z-50">
      <nav className="h-full flex flex-col">
        <Link to="/admin" className="p-4 flex items-center justify-center">
          <img 
            src={logoImage} 
            alt="Logo" 
            className="w-8 h-8 group-hover:w-12 group-hover:h-12 transition-all duration-300" 
          />
        </Link>
        
        {menuItems.map((item) => (
          <div
            key={item.name}
            className="relative group"
            onMouseEnter={() => setHoveredItem(item.name)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <Link
              to={item.link}
              className={`
                flex items-center p-4 text-white hover:bg-primary 
                ${location.pathname === item.link ? 'bg-primary' : ''}
              `}
            >
              <item.icon className="w-6 h-6 shrink-0" />
              <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {item.name}
              </span>
            </Link>
            
            {hoveredItem === item.name && item.subItems.length > 0 && (
              <div className="absolute left-full top-0 bg-primary-dark rounded-md shadow-lg z-10">
                {item.subItems.map((subItem) => (
                  <Link
                    key={subItem.name}
                    to={subItem.link}
                    className="block px-4 py-2 hover:bg-primary whitespace-nowrap"
                  >
                    {subItem.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;