import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Message from './Message/Message';

import './Chat.scss';

const Chat = ({
  messages,
  sendMessage,
  reactToMessage,
  scrollBottomRef,
  disabled,
}) => {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const submitMessage = (e) => {
    e.preventDefault();
    sendMessage(message);
    setMessage('');
  };

  return (
    <div className="chat">
      <div className="messages">
        {messages &&
          messages.map(({ id, content, reaction, received }) => (
            <Message
              key={id}
              id={id}
              content={content}
              reaction={reaction}
              received={received}
              onReaction={reactToMessage}
            />
          ))}
        <div ref={scrollBottomRef} />
      </div>
      <form className="message-input">
        <input
          type="text"
          value={message}
          onChange={handleMessageChange}
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
  sendMessage: PropTypes.func.isRequired,
  reactToMessage: PropTypes.func.isRequired,
  scrollBottomRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  disabled: PropTypes.bool,
};

export default Chat;
