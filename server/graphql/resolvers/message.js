const { Op } = require('sequelize');
const { UserInputError, AuthenticationError } = require('apollo-server');

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
      order: [['createdAt', 'DESC']],
    });

    return messages;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const sendMessage = async (_, { content, to }, { user }) => {
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

    return message;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const reactToMessage = async (_, { messageId, reaction }, { user }) => {
  if (!user) {
    throw new AuthenticationError('Unauthenticated');
  }

  try {
    const message = await Message.findOne({ where: { id: messageId } });
    if (!message) {
      throw new UserInputError('Message not found');
    }

    await message.update({ reaction });

    return message;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getConversation,
  sendMessage,
  reactToMessage,
};
