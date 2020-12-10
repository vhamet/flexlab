import { useEffect, useContext } from 'react';
import jwtDecode from 'jwt-decode';

import AuthenticationContext from './authenticationContext';

const useAuthenticationChecker = () => {
  const { logout } = useContext(AuthenticationContext);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const expiresAt = new Date(decodedToken.exp * 1000);
      if (new Date() > expiresAt) {
        localStorage.removeItem('token');
        logout();
      }
    }
  });
};

export default useAuthenticationChecker;
