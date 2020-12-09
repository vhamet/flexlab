import React, { useState, useContext } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import PropTypes from 'prop-types';

import FormInput from '../../components/FormInput/FormInput';
import AuthenticationContext from '../../authentication/authenticationContext';
import { SIGNUP_MUTATION } from '../../graphql/queries';

import './Signup.scss';

const Signup = ({ history }) => {
  const [variables, setVariables] = useState({
    username: '',
    email: '',
    password: '',
    confirmation: '',
  });
  const [error, setError] = useState();
  const {
    state: { user },
  } = useContext(AuthenticationContext);

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    update: (_, __) => history.push('/login'),
    onError: (err) => setError(err.message),
  });

  if (user) {
    return <Redirect to="/" />;
  }

  const handleInputChange = (e, property) =>
    setVariables({ ...variables, [property]: e.target.value });

  const submitSignup = (e) => {
    e.preventDefault();
    signup({ variables });
  };

  return (
    <form className="signup">
      <h2>Sign Up !</h2>
      <FormInput
        label="Username"
        name="username"
        value={variables.username}
        type="text"
        placeholder="Enter username"
        onChange={(e) => handleInputChange(e, 'username')}
      />
      <FormInput
        label="Email address"
        name="email"
        value={variables.email}
        type="email"
        placeholder="Enter email address"
        onChange={(e) => handleInputChange(e, 'email')}
      />
      <FormInput
        label="Password"
        name="password"
        value={variables.password}
        type="password"
        placeholder="Enter password"
        onChange={(e) => handleInputChange(e, 'password')}
      />
      <FormInput
        label="Confirmation"
        name="confirmation"
        value={variables.confirmation}
        type="password"
        placeholder="Enter password confirmation"
        onChange={(e) => handleInputChange(e, 'confirmation')}
      />

      <p className="error">{error}</p>

      <button type="submit" onClick={submitSignup} disabled={loading}>
        {loading ? 'Loading...' : 'Sign up'}
      </button>
      <p>
        Already registered ? <Link to="/login">Log in</Link>.
      </p>
    </form>
  );
};

Signup.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default Signup;
