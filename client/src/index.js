import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import Apollo from './apollo/Apollo';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Apollo>
      <Router>
        <App />
      </Router>
    </Apollo>
  </React.StrictMode>,
  document.getElementById('root')
);
