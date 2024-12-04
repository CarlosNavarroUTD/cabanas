import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import TokenService from './tokenService';

const PrivateRoute = ({ children, allowedRoles = ['admin', 'arrendador'] }) => {
  // Verificar el accessToken
  const accessToken = TokenService.getAccessToken();
  const isAuthenticated = accessToken !== null;
  
  // Obtener el tipo de usuario del token
  const userType = TokenService.getUserType();
  
  console.group('PrivateRoute Debugging');
  console.log("Access Token:", !!accessToken);
  console.log("Is Authenticated:", isAuthenticated);
  console.log("User Type:", userType);
  console.log("Allowed Roles:", allowedRoles);
  console.log("Has Required Role:", allowedRoles.includes(userType));
  console.groupEnd();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    console.log("Not authenticated - redirecting to login");
    return <Navigate to="/login" replace />;
  }

  // Verificar si el tipo de usuario está en los roles permitidos
  const hasRequiredRole = allowedRoles.includes(userType);
  
  console.log("Has Required Role:", hasRequiredRole);
  console.log("Allowed Roles:", allowedRoles);

  // Si tiene un rol permitido, renderizar el componente o outlet
  if (hasRequiredRole) {
    return children ? children : <Outlet />;
  }

  // Si no tiene un rol permitido, redirigir
  console.log("Unauthorized access - redirecting to login");
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;