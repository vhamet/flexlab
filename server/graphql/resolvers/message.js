const { Op } = require('sequelize');
const {
  UserInputError,
  AuthenticationError,
  withFilter,
} = require('apollo-server');

const { Message, User } = require('../../models');

const getConversation = async (_, { withUser }, { user }) => {
  if (!user) {
    throw new AuthenticationError('Unauthenticated');
  }

  try {
    const users = [user.id, withUser];
    const messages = await Message.findAll({
      where: {
        from: { [Op.in]: users },
        to: { [Op.in]: users },
      },
      order: [['createdAt', 'ASC']],
    });

    return messages;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const sendMessage = async (_, { content, to }, { user, pubsub }) => {
  if (!user) {
    throw new AuthenticationError('Unauthenticated');
  }

  try {
    if (!content.trim().length) {
      throw new UserInputError('You cannot send an empty message');
    }
    const recipient = await User.findOne({ where: { id: to } });
    if (!recipient) {
      throw new UserInputError('Unknown user');
    }

    const message = await Message.create({
      content,
      from: user.id,
      to: recipient.id,
    });

    pubsub.publish('NEW_MESSAGE', { newMessage: message });

    return message;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const reactToMessage = async (_, { messageId, reaction }, { user, pubsub }) => {
  if (!user) {
    throw new AuthenticationError('Unauthenticated');
  }

  try {
    const message = await Message.findOne({ where: { id: messageId } });
    if (!message) {
      throw new UserInputError('Message not found');
    }

    await message.update({ reaction });

    pubsub.publish('NEW_REACTION', { newReaction: message.toJSON() });

    return message;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const newMessage = {
  subscribe: withFilter(
    (_, __, { pubsub, user }) => {
      if (!user) {
        throw new AuthenticationError('Unauthenticated');
      }

      return pubsub.asyncIterator('NEW_MESSAGE');
    },
    (parent, _, { user }) => {
      if (
        parent.newMessage.from === user.id ||
        parent.newMessage.to === user.id
      ) {
        return true;
      }

      return false;
    }
  ),
};

const newReaction = {
  subscribe: withFilter(
    (_, __, { pubsub, user }) => {
      if (!user) {
        throw new AuthenticationError('Unauthenticated');
      }

      return pubsub.asyncIterator('NEW_REACTION');
    },
    (parent, _, { user }) => {
      if (
        parent.newReaction.from === user.id ||
        parent.newReaction.to === user.id
      ) {
        return true;
      }

      return false;
    }
  ),
};

module.exports = {
  getConversation,
  sendMessage,
  reactToMessage,
  newMessage,
  newReaction,
};
