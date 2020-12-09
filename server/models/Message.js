module.exports = (sequelize, DataTypes, User) => {
  const Message = sequelize.define('messages', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reaction: {
      type: DataTypes.STRING,
    },
  });

  Message.belongsTo(User, { foreignKey: 'from', as: 'FromUser' });
  Message.belongsTo(User, { foreignKey: 'to', as: 'ToUser' });

  Message.sync({ alter: true });

  return Message;
};
