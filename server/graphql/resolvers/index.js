const { getUsers, signup, login } = require('./user');
const {
  getConversation,
  sendMessage,
  reactToMessage,
  newMessage,
  newReaction,
} = require('./message');

module.exports = {
  Query: {
    getUsers,
    getConversation,
  },
  Mutation: {
    signup,
    login,
    sendMessage,
    reactToMessage,
  },
  Subscription: {
    newMessage,
    newReaction,
  },
};
