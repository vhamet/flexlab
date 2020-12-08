const Sequelize = require('sequelize');

const UserModel = require('./user');

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

module.exports = { sequelize, User };
