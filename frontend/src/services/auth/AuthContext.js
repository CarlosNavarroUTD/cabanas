// AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import AuthService from './AuthService';
import TokenService from './tokenService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const accessToken = TokenService.getAccessToken();
      console.log('AuthProvider - Access Token:', accessToken);
      
      if (accessToken) {
        try {
          const user = await AuthService.getCurrentUser();
          
          // Add comprehensive logging
          console.log('Fetched user in AuthProvider:', user);
          console.log('User Type:', user?.tipo_usuario);
          console.log('Arrendador Info:', user?.arrendador_info);
          console.log('Arrendador ID:', user?.arrendador_id);
          console.log('Full User Object:', JSON.stringify(user, null, 2));

          setCurrentUser(user);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch user in AuthProvider:', error);
          setCurrentUser(null);
          setIsAuthenticated(false);
          TokenService.removeTokens();
        }
      } else {
        console.log('No access token found');
      }
    };

    fetchCurrentUser();
  }, []); 

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isAuthenticated, 
      setCurrentUser, 
      setIsAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};