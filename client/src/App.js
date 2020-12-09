import React, { useReducer } from 'react';
import { Route, Switch } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import Header from './components/Header/Header';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ChatApp from './pages/ChatApp/ChatApp';
import AuthenticationContext from './authentication/authenticationContext';
import authenticationReducer from './authentication/authenticationReducer';

import './App.scss';

let user = null;
const token = localStorage.getItem('token');
if (token) {
  const decodedToken = jwtDecode(token);
  const expiresAt = new Date(decodedToken.exp * 1000);

  if (new Date() > expiresAt) {
    localStorage.removeItem('token');
  } else {
    user = decodedToken;
  }
}

const App = () => {
  const [state, dispatch] = useReducer(authenticationReducer, { user });
  const login = (user) => dispatch({ type: 'LOGIN', payload: user });
  const logout = () => dispatch({ type: 'LOGOUT' });

  return (
    <AuthenticationContext.Provider value={{ state, login, logout }}>
      <div className="app-container">
        <Header />
        <div className="app-content">
          <Switch>
            <Route exact path="/" component={ChatApp} />
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
          </Switch>
        </div>
      </div>
    </AuthenticationContext.Provider>
  );
};

export default App;
