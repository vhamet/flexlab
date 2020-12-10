const Sequelize = require('sequelize');

const UserModel = require('./User');
const MessageModel = require('./Message');

const sequelize = new Sequelize(
  `postgres://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@postgres:5432/${process.env.DATABASE}`
);

const User = UserModel(sequelize, Sequelize);
const Message = MessageModel(sequelize, Sequelize, User);

sequelize.sync();

module.exports = { sequelize, User, Message };
