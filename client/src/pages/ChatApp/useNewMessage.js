import { useContext, useEffect } from 'react';
import { useSubscription } from '@apollo/client';

import {
  GET_CONVERSATION_QUERY,
  NEW_MESSAGE_SUBSCRIPTION,
} from '../../graphql/queries';
import { ApolloContext } from '../../apollo/Apollo';
import AuthenticationContext from '../../authentication/authenticationContext';

const useNewMessage = (recipient, setNotifications, scrollToBottom) => {
  const store = useContext(ApolloContext);
  const {
    state: { user },
  } = useContext(AuthenticationContext);
  const { data, error } = useSubscription(NEW_MESSAGE_SUBSCRIPTION);

  useEffect(() => {
    if (error) console.log(error);

    if (data) {
      const withUser =
        data.newMessage.from === user.id
          ? data.newMessage.to
          : data.newMessage.from;
      const conversation = store.readQuery({
        query: GET_CONVERSATION_QUERY,
        variables: { withUser },
      });

      if (conversation) {
        const updatedConversation = {
          getConversation: [...conversation.getConversation, data.newMessage],
        };
        store.writeQuery({
          query: GET_CONVERSATION_QUERY,
          variables: { withUser },
          data: updatedConversation,
        });
        scrollToBottom();
      }

      if (
        recipient !== data.newMessage.from &&
        recipient !== data.newMessage.to
      ) {
        setNotifications((n) => [...n, data.newMessage.from]);
      }
    }
  }, [error, data]);
};

export default useNewMessage;
