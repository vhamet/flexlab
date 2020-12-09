import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import AuthenticationContext from '../../authentication/authenticationContext';

import './Header.scss';

const Header = () => {
  const {
    state: { user },
    logout,
  } = useContext(AuthenticationContext);

  return (
    <header className="header">
      <div className="filler" />
      <Link to="/">
        <h1>Flexlab Chat</h1>
      </Link>
      <div className="authentication-links">
        {user ? (
          <label onClick={logout}>Logout</label>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
