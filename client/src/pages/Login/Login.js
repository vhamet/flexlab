import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import FormInput from '../../components/FormInput/FormInput';
import AuthenticationContext from '../../authentication/authenticationContext';
import { LOGIN_MUTATION } from '../../graphql/queries';

const Login = ({ history }) => {
  const [variables, setVariables] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState();
  const {
    state: { user },
    login: dispatchLogin,
  } = useContext(AuthenticationContext);

  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    update: (_, { data }) => {
      dispatchLogin(data.login);
      history.push('/');
    },
    onError: (err) => setError(err.message),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  const handleInputChange = (e, property) =>
    setVariables({ ...variables, [property]: e.target.value });

  const submitLogin = () => {
    login({ variables });
  };

  return (
    <div className="login">
      <h2>Log in !</h2>
      <FormInput
        label="Username"
        name="username"
        value={variables.username}
        type="text"
        placeholder="Enter username"
        onChange={(e) => handleInputChange(e, 'username')}
      />
      <FormInput
        label="Password"
        name="password"
        value={variables.password}
        type="password"
        placeholder="Enter password"
        onChange={(e) => handleInputChange(e, 'password')}
      />

      <p className="error">{error}</p>

      <button onClick={submitLogin} disabled={loading}>
        {loading ? 'Loading...' : 'Log in'}
      </button>
      <p>
        Not signed up yet ? <Link to="/signup">Sign up</Link>.
      </p>
    </div>
  );
};

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default Login;
