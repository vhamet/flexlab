import React from 'react';
import PropTypes from 'prop-types';

import './Chat.scss';

const Chat = ({
  messages,
  message,
  onMessageInput,
  sendMessage,
  scrollBottomRef,
  disabled,
}) => {
  const submitMessage = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages &&
          messages.map(({ id, content, reaction, received }) => (
            <div
              key={id}
              className={`message ${received ? 'received' : 'sent'}`}
            >
              {content}
              {reaction}
            </div>
          ))}
        <div ref={scrollBottomRef} />
      </div>
      <form className="message-input">
        <input
          type="text"
          value={message}
          onChange={onMessageInput}
          placeholder="Send message"
          disabled={disabled}
        />
        <button
          type="submit"
          onClick={submitMessage}
          disabled={!message || disabled}
        >
          ✉️
        </button>
      </form>
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
  scrollBottomRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  disabled: PropTypes.bool,
};

export default Chat;
