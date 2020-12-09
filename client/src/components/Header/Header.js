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
      <div />
      <Link to="/">
        <h1>Flexlab Chat</h1>
      </Link>
      <div className="authentication-links">
        {user ? (
          <label onClick={logout}>Log out</label>
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
