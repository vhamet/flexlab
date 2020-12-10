import React from 'react';
import PropTypes from 'prop-types';

const Reaction = ({ emoji, onClick }) => {
  return (
    <span className="emoji" onClick={onClick}>
      {emoji}
    </span>
  );
};

Reaction.propTypes = { emoji: PropTypes.string, onClick: PropTypes.func };

export default Reaction;
