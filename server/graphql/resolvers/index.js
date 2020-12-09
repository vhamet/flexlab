const { getUsers, signUp, login } = require('./user');
const { getMessages, sendMessage, reactToMessage } = require('./message');

module.exports = {
  Query: {
    getUsers,
    getMessages,
  },
  Mutation: {
    signUp,
    login,
    sendMessage,
    reactToMessage,
  },
};
