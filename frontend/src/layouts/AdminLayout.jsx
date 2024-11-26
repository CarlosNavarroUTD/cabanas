import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import AdminNavbar from '../components/AdminNavbar';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 pl-16">
        {/* Top Navigation Bar */}
        <AdminNavbar />
        
        {/* Main content with padding to avoid overlap with navbar */}
        <main className="pt-20 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;