import jwtDecode from 'jwt-decode';

const authenticationReducer = (state = { user: null }, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('token', action.payload.token);
      const decodedToken = jwtDecode(action.payload.token);
      return {
        ...state,
        user: decodedToken,
      };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default authenticationReducer;
