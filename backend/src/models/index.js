const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const AiModel = require('./ai');

const User = require('./user')(sequelize, DataTypes);
const Caption = require('./captions')(sequelize, DataTypes);

User.hasMany(Caption, { foreignKey: 'user_id' });
Caption.belongsTo(User, { foreignKey: 'user_id' });

module.exports = {
  sequelize,
  User,
  Caption,
  AiModel
};
