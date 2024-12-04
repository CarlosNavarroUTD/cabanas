import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/auth/AuthContext';
import PrivateRoute from './services/auth/PrivateRoute';
import TokenService from './services/auth/tokenService';
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
import ManageActivities from './pages/admin/ManageActivities';
import AddActivity from './pages/admin/AddActivity';
import ManagePackages from './pages/admin/ManagePackages';
import AddPackage from './pages/admin/AddPackage';
import ManageBookings from './pages/admin/ManageBookings';

// Admin-only Route Component
const AdminRoute = ({ children }) => {
  const isAdmin = TokenService.isAdmin();
  
  return isAdmin ? (
    <>{children}</>
  ) : (
    <Navigate to="/login" replace />
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="cabins" element={<Cabins />} />
            <Route path="cabins/:id" element={<CabinDetail />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="nosotros" element={<Nosotros />} />
          </Route>

          
          <Route 
            path="/admin" 
            element={
              <PrivateRoute>
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="profile" element={<ProfilePage />} />
            
            {/* Cabins routes */}
            <Route path="cabins" element={<ManageCabins />} />
            <Route path="cabins/add" element={<AddCabinForm />} />
            
            {/* Users routes */}
            <Route path="users" element={<Users />} />
            
            {/* Activities routes */}
            <Route path="activities" element={<ManageActivities />} />
            <Route path="activities/add" element={<AddActivity />} />
            
            {/* Packages routes */}
            <Route path="packages" element={<ManagePackages />} />
            <Route path="packages/add" element={<AddPackage />} />
            
            {/* Bookings routes */}
            <Route path="bookings" element={<ManageBookings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;