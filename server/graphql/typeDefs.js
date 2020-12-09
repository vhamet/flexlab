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
    getMessages(to: Int!): [Message]!
  }

  type Mutation {
    signUp(
      username: String!
      email: String!
      password: String!
      confirm: String!
    ): User!
    login(username: String!, password: String!): User!
    sendMessage(content: String!, to: String!): Message
    reactToMessage(messageId: Int!, reaction: String): Message!
  }
`;
