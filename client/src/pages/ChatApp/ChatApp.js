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
import {
  GET_USERS_QUERY,
  GET_CONVERSATION_QUERY,
  SEND_MESSAGE_MUTATION,
  REACT_TO_MESSAGE_MUTATION,
  NEW_REACTION_SUBSCRIPTION,
} from '../../graphql/queries';

import './ChatApp.scss';
import useNewMessage from './useNewMessage';

const ChatApp = () => {
  useAuthenticationChecker();
  const [notifications, setNotifications] = useState([]);
  const {
    state: { user },
  } = useContext(AuthenticationContext);

  const { loading, error, data, refetch } = useQuery(GET_USERS_QUERY);

  const [loadConversation, { data: dataConversation }] = useLazyQuery(
    GET_CONVERSATION_QUERY
  );

  const scrollBottomRef = useRef(null);
  const scrollToBottom = () =>
    scrollBottomRef.current &&
    scrollBottomRef.current.scrollIntoView({
      behavior: 'instant',
      block: 'end',
    });

  useEffect(() => {
    scrollToBottom();
  }, [dataConversation]);

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION, {
    onError: (err) => console.log(err.message),
  });

  const [reactToMessage] = useMutation(REACT_TO_MESSAGE_MUTATION, {
    onError: (err) => console.log(err.message),
  });

  const [recipient, setRecipient] = useState();
  useNewMessage(recipient, setNotifications, scrollToBottom);
  useSubscription(NEW_REACTION_SUBSCRIPTION);

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

  const handleSendMessage = (message) => {
    sendMessage({ variables: { content: message, to: recipient } });
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
        sendMessage={handleSendMessage}
        reactToMessage={reactToMessage}
        scrollBottomRef={scrollBottomRef}
        disabled={!recipient}
      />
    </div>
  );
};

export default ChatApp;
