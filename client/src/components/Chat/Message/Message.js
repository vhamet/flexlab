import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Reaction from '../Reaction/Reaction';

import './Message.scss';

const Message = ({ id, content, reaction, received, onReaction }) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div key={id} className={`message ${received ? 'received' : 'sent'}`}>
      {!received && reaction && <span className="reaction">{reaction}</span>}
      <span className="content">{content}</span>
      {received && (
        <span
          className={reaction ? 'reaction' : 'react'}
          onClick={() => setShowReactions((show) => !show)}
        >
          {showReactions ? (
            <span className="reactions">
              {['😀', '👍', '👎', '😡'].map((emoji, i) => (
                <Reaction
                  key={i}
                  emoji={emoji}
                  onClick={() =>
                    onReaction({
                      variables: { messageId: id, reaction: emoji },
                    })
                  }
                />
              ))}
            </span>
          ) : (
            reaction || '☺'
          )}
        </span>
      )}
    </div>
  );
};

Message.propTypes = {
  id: PropTypes.number,
  content: PropTypes.string,
  reaction: PropTypes.string,
  received: PropTypes.bool,
  onReaction: PropTypes.func.isRequired,
};

export default Message;
