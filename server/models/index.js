const Sequelize = require('sequelize');

const UserModel = require('./User');
const MessageModel = require('./Message');

const sequelize = new Sequelize(
  'flexlab_chat',
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: 'localhost',
    dialect: 'postgres',
  }
);

const User = UserModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize, User);

module.exports = { sequelize, User, Message };
