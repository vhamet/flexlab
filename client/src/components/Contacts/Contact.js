import React from 'react';
import PropTypes from 'prop-types';

const Contact = ({ id, username, selected, withNotification, onClick }) => {
  console.log('render', username);
  return (
    <div
      key={id}
      className={`contact${selected ? ' selected' : ''}`}
      onClick={onClick}
    >
      {username}
      {withNotification && <span className="notification">🔴</span>}
    </div>
  );
};

Contact.propTypes = {
  id: PropTypes.number.isRequired,
  username: PropTypes.string.isRequired,
  selected: PropTypes.bool,
  withNotification: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};

export default React.memo(Contact, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.username === nextProps.username &&
    prevProps.selected === nextProps.selected &&
    prevProps.withNotification === nextProps.withNotification
  );
});
