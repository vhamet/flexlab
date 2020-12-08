const { User } = require('../models');

module.exports = {
  Query: {
    getUsers: async () => {
      const users = await User.findAll();

      return users;
    },
  },
};
