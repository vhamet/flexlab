import React from 'react';
import PropTypes from 'prop-types';

const Chat = ({ messages, message, onMessageInput, sendMessage }) => {
  return (
    <div className="chat">
      {messages &&
        messages.map(({ id, content, reaction }) => (
          <div key={id}>
            {content}
            {reaction}
          </div>
        ))}
      <input type="text" value={message} onChange={onMessageInput} />
      <label onClick={sendMessage}>📨</label>
    </div>
  );
};

Chat.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      from: PropTypes.number.isRequired,
      to: PropTypes.number.isRequired,
      content: PropTypes.string.isRequired,
      reaction: PropTypes.string,
    })
  ),
  message: PropTypes.string,
  onMessageInput: PropTypes.func.isRequired,
  sendMessage: PropTypes.func.isRequired,
};

export default Chat;
