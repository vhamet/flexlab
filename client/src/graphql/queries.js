import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation signup(
    $username: String!
    $email: String!
    $password: String!
    $confirmation: String!
  ) {
    signup(
      username: $username
      email: $email
      password: $password
      confirm: $confirmation
    ) {
      username
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      username
      token
    }
  }
`;

export const GET_USERS_QUERY = gql`
  query getUsers {
    getUsers {
      id
      username
    }
  }
`;

export const GET_CONVERSATION_QUERY = gql`
  query getConversation($withUser: Int!) {
    getConversation(withUser: $withUser) {
      id
      content
      from
      to
      reaction
    }
  }
`;

export const SEND_MESSAGE_MUTATION = gql`
  mutation sendMessage($content: String!, $to: Int!) {
    sendMessage(content: $content, to: $to) {
      id
      from
      to
      content
      reaction
    }
  }
`;
