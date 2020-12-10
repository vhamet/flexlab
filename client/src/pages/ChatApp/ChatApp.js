import React, { useContext, useState, useEffect, useRef } from 'react';
import {
  useQuery,
  useLazyQuery,
  useMutation,
  useSubscription,
} from '@apollo/client';
import { Redirect } from 'react-router-dom';

import Contacts from '../../components/Contacts/Contacts';
import Chat from '../../components/Chat/Chat';
import AuthenticationContext from '../../authentication/authenticationContext';
import useAuthenticationChecker from '../../authentication/useAuthenticationChecker';
import { ApolloContext } from '../../apollo/Apollo';
import {
  GET_USERS_QUERY,
  GET_CONVERSATION_QUERY,
  SEND_MESSAGE_MUTATION,
  NEW_MESSAGE_SUBSCRIPTION,
  REACT_TO_MESSAGE_MUTATION,
  NEW_REACTION_SUBSCRIPTION,
} from '../../graphql/queries';

import './ChatApp.scss';

const ChatApp = () => {
  useAuthenticationChecker();
  const scrollBottomRef = useRef(null);
  const [message, setMessage] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [recipient, setRecipient] = useState();
  const {
    state: { user },
  } = useContext(AuthenticationContext);
  const store = useContext(ApolloContext);

  const { loading, error, data, refetch } = useQuery(GET_USERS_QUERY);

  const [
    loadConversation,
    { loading: loadingConversation, data: dataConversation },
  ] = useLazyQuery(GET_CONVERSATION_QUERY);

  const [sendMessage, { loadingSendMessage }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: () => {
        setMessage('');
      },
      onError: (err) => console.log(err.message),
    }
  );

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE_MUTATION, {
    onError: (err) => console.log(err.message),
  });

  useEffect(() => {
    scrollBottomRef.current &&
      scrollBottomRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'end',
      });
  }, [dataConversation]);

  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE_SUBSCRIPTION
  );

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      const withUser =
        messageData.newMessage.from === user.id
          ? messageData.newMessage.to
          : messageData.newMessage.from;
      const conversation = store.readQuery({
        query: GET_CONVERSATION_QUERY,
        variables: { withUser },
      });
      const updatedConversation = {
        getConversation: [
          ...conversation.getConversation,
          messageData.newMessage,
        ],
      };
      store.writeQuery({
        query: GET_CONVERSATION_QUERY,
        variables: { withUser },
        data: updatedConversation,
      });
      scrollBottomRef.current &&
        scrollBottomRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'end',
        });

      if (
        recipient !== messageData.newMessage.from &&
        recipient !== messageData.newMessage.to
      ) {
        setNotifications((n) => [...n, messageData.newMessage.from]);
      }
    }
  }, [messageError, messageData]);

  const { data: reactionData, error: reactionError } = useSubscription(
    NEW_REACTION_SUBSCRIPTION
  );

  if (!user) {
    return <Redirect to="/login" />;
  }

  const contacts = data && data.getUsers.filter(({ id }) => id !== user.id);
  const messages =
    dataConversation &&
    dataConversation.getConversation.map((message) => ({
      ...message,
      received: message.from !== user.id,
    }));

  const selectConversation = (userId) => {
    setNotifications((ns) => ns.filter((n) => n !== userId));
    setRecipient(userId);
    loadConversation({ variables: { withUser: userId } });
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="chatapp">
      <Contacts
        error={error}
        loading={loading}
        contacts={contacts}
        retry={refetch}
        selectConversation={selectConversation}
        currentContact={recipient}
        notifications={notifications}
      />
      <Chat
        messages={messages}
        message={message}
        onMessageInput={handleMessageChange}
        sendMessage={() =>
          sendMessage({ variables: { content: message, to: recipient } })
        }
        reactToMessage={reactToMessage}
        scrollBottomRef={scrollBottomRef}
        disabled={!recipient}
      />
    </div>
  );
};

export default ChatApp;
