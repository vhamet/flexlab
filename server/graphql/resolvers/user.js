const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const validator = require('email-validator');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { User } = require('../../models');

const validateInput = (username, email, password, confirm) => {
  if (!username.trim().length) {
    return 'Username cannot be empty';
  }

  if (!validator.validate(email)) {
    return 'Email address is invalid';
  }

  if (!password.trim().length) {
    return 'Password cannot be empty';
  }

  if (password !== confirm) {
    return 'Password missmatch';
  }

  return null;
};

const getUsers = async (_, __, { user }) => {
  if (!user) {
    throw new AuthenticationError('Unauthenticated');
  }

  try {
    const users = await User.findAll({ order: [['username', 'ASC']] });

    return users;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const signup = async (_, { username, email, password, confirm }) => {
  try {
    const isInputInvalid = validateInput(username, email, password, confirm);
    if (isInputInvalid) {
      throw new UserInputError(isInputInvalid);
    }

    const existingUser = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existingUser) {
      if (existingUser.username === username) {
        throw new UserInputError('Username already taken');
      }

      throw new UserInputError('Email already taken');
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: encryptedPassword,
    });

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const login = async (_, { username, password }) => {
  try {
    const user = await User.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new UserInputError('User not found');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AuthenticationError('Invalid credentials');
    }

    const token = jwt.sign(
      {
        id: user.id,
        username,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 3600 }
    );
    user.token = token;

    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  getUsers,
  signup,
  login,
};
