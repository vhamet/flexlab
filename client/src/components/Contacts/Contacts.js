import React from 'react';
import PropTypes from 'prop-types';

const Contacts = ({ loading, error, contacts, retry, selectConversation }) => {
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
    content = contacts.map((contact) => (
      <div
        key={contact.id}
        className="contact"
        onClick={selectConversation.bind(null, contact.id)}
      >
        {contact.username}
      </div>
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
};

export default Contacts;
