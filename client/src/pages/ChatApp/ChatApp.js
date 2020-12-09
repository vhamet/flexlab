import React, { useContext, useState, useEffect } from 'react';
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
import { ApolloContext } from '../../apollo/Apollo';
import {
  GET_USERS_QUERY,
  GET_CONVERSATION_QUERY,
  SEND_MESSAGE_MUTATION,
  NEW_MESSAGE_SUBSCRIPTION,
} from '../../graphql/queries';

import './ChatApp.scss';

const ChatApp = () => {
  const [message, setMessage] = useState('');
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
  const messages = dataConversation && dataConversation.getConversation;

  const [sendMessage, { loadingSendMessage, client }] = useMutation(
    SEND_MESSAGE_MUTATION,
    {
      update: () => {
        setMessage('');
      },
      onError: (err) => console.log(err.message),
    }
  );

  const { data: messageData, error: messageError } = useSubscription(
    NEW_MESSAGE_SUBSCRIPTION
  );

  useEffect(() => {
    if (messageError) console.log(messageError);

    if (messageData) {
      console.log(messageData);
      const conversation = store.readQuery({
        query: GET_CONVERSATION_QUERY,
        variables: { withUser: recipient },
      });
      const updatedConversation = {
        getConversation: [
          ...conversation.getConversation,
          messageData.newMessage,
        ],
      };
      store.writeQuery({
        query: GET_CONVERSATION_QUERY,
        variables: { withUser: recipient },
        data: updatedConversation,
      });
    }
  }, [messageError, messageData]);

  if (!user) {
    return <Redirect to="/login" />;
  }

  const selectConversation = (userId) => {
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
        contacts={data && data.getUsers.filter((u) => u.id !== user.id)}
        retry={refetch}
        selectConversation={selectConversation}
      />
      <Chat
        messages={messages}
        message={message}
        onMessageInput={handleMessageChange}
        sendMessage={() =>
          sendMessage({ variables: { content: message, to: recipient } })
        }
      />
    </div>
  );
};

export default ChatApp;
