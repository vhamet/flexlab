import React from 'react';
import PropTypes from 'prop-types';

import Contact from './Contact';

import './Contacts.scss';

const Contacts = ({
  loading,
  error,
  contacts,
  retry,
  selectConversation,
  currentContact,
  notifications,
}) => {
  const handleSelection = (contact) => {
    selectConversation(contact);
  };

  let content;
  if (error) {
    content = (
      <button onClick={() => retry()}>
        An error occured, please try again 🔄
      </button>
    );
  } else if (loading) {
    content = <label>Loading...</label>;
  } else if (contacts) {
    content = contacts.map(({ id, username }) => (
      <Contact
        key={id}
        id={id}
        username={username}
        selected={currentContact === id}
        withNotification={notifications.includes(id)}
        onClick={() => handleSelection(id)}
      />
    ));
  }
  return (
    <div className="contacts">
      <h3>Contacts</h3>
      <div className="content">{content}</div>
    </div>
  );
};

Contacts.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.bool,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      username: PropTypes.string.isRequired,
    })
  ),
  retry: PropTypes.func,
  selectConversation: PropTypes.func,
  currentContact: PropTypes.number,
  notifications: PropTypes.arrayOf(PropTypes.number),
};

export default Contacts;
