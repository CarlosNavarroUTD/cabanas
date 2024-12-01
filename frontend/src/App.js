import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/auth/AuthContext';
import PrivateRoute from './services/auth/PrivateRoute';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/public/Home';
import Cabins from './pages/public/Cabins';
import CabinDetail from './pages/public/CabinDetail';
import LoginPage from './pages/public/auth/LoginScreen';
import RegisterPage from './pages/public/auth/RegisterScreen';
import Dashboard from './pages/admin/Dashboard';
import ManageCabins from './pages/admin/ManageCabins';
import AddCabinForm from './pages/admin/AddCabinForm';
import Users from './pages/admin/Users';
import ProfilePage from './pages/admin/ProfilePage';
import Nosotros from './pages/public/Nosotros';
// Add these new components
import ManageActivities from './pages/admin/ManageActivities';
import AddActivity from './pages/admin/AddActivity';
import ManagePackages from './pages/admin/ManagePackages';
import AddPackage from './pages/admin/AddPackage';
import ManageBookings from './pages/admin/ManageBookings';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="cabins" element={<Cabins />} />
            <Route path="cabins/:id" element={<CabinDetail />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="nosotros" element={<Nosotros />} />

            
          </Route>

          {/* Admin routes */}
          <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Cabins routes */}
            <Route path="cabins" element={<ManageCabins />} />
            <Route path="cabins/add" element={<AddCabinForm />} />
            
            {/* Activities routes */}
            <Route path="actividades" element={<ManageActivities />} />
            <Route path="actividades/añadir" element={<AddActivity />} />
            
            {/* Packages routes */}
            <Route path="paquetes" element={<ManagePackages />} />
            <Route path="paquetes/añadir" element={<AddPackage />} />
            
            {/* Bookings routes */}
            <Route path="reservas" element={<ManageBookings />} />
            
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;