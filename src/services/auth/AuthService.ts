// /services/auth/auth.Service.ts

const AuthService = {
    login: (userData: any) => {
      localStorage.setItem('user', JSON.stringify(userData));
    },
  
    logout: () => {
      localStorage.removeItem('user');
    },
  
    getCurrentUser: () => {
      if (typeof window === 'undefined') return null;
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
  };
  
  export default AuthService;
  