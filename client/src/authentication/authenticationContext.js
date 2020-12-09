import { createContext } from 'react';

const AuthenticationContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export default AuthenticationContext;
