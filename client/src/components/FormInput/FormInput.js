import React from 'react';
import PropTypes from 'prop-types';

import './FormInput.scss';

const FormInput = ({ label, name, value, onChange, ...props }) => {
  return (
    <div className="form-input">
      <label htmlFor={name}>{label}</label>
      <input name={name} {...props} value={value} onChange={onChange} />
    </div>
  );
};

FormInput.propTypes = {
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default FormInput;
