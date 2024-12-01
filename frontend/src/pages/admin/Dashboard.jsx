import React from 'react';
import { Home, PlusCircle, Calendar, Star, DollarSign } from 'lucide-react';

// Componente de tarjeta personalizado
const DashboardCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition-shadow">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

// Componente de botón personalizado (usando <a> en lugar de Link)
const DashboardButton = ({ href, children, icon: Icon }) => (
  <a 
    href={href} 
    className="flex items-center px-4 py-2 bg-primary-dark text-white rounded-md hover:bg-primary transition-colors"
  >
    {Icon && <Icon className="mr-2 h-4 w-4" />}
    {children}
  </a>
);

export default function Dashboard() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Cabin Management Dashboard</h1>

      {/* Grid de tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard 
          title="Total Cabins" 
          value="25" 
          icon={Home} 
        />
        <DashboardCard 
          title="Occupancy Rate" 
          value="78%" 
          icon={Calendar} 
        />
        <DashboardCard 
          title="Average Rating" 
          value="4.7" 
          icon={Star} 
        />
        <DashboardCard 
          title="Total Revenue" 
          value="$12,345" 
          icon={DollarSign} 
        />
      </div>

      {/* Sección de botones */}
      <div className="mt-8 flex space-x-4">
        <DashboardButton href="/admin/cabins" icon={Home}>
          View All Cabins
        </DashboardButton>
        <DashboardButton href="/admin/cabins/add" icon={PlusCircle}>
          Add New Cabin
        </DashboardButton>
      </div>
    </div>
  );
}