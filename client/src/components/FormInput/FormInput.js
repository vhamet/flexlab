import React from 'react';
import PropTypes from 'prop-types';

const FormInput = ({ label, name, value, onChange, ...props }) => {
  return (
    <div>
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
