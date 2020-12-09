const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: Int!
    username: String!
    email: String!
    token: String
  }

  type Message {
    id: Int!
    content: String!
    from: Int!
    to: Int!
    reaction: String
  }

  type Query {
    getUsers: [User]!
    getConversation(withUser: Int!): [Message]!
  }

  type Mutation {
    signup(
      username: String!
      email: String!
      password: String!
      confirm: String!
    ): User!
    login(username: String!, password: String!): User!
    sendMessage(content: String!, to: Int!): Message
    reactToMessage(messageId: Int!, reaction: String): Message!
  }

  type Subscription {
    newMessage: Message!
  }
`;
