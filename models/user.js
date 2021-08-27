'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    username: DataTypes.STRING,
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    indicative: DataTypes.STRING,
    phone: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    isAuthPhone: DataTypes.BOOLEAN,
    isAuthGoogle: DataTypes.BOOLEAN,
    isAuthFacebook: DataTypes.BOOLEAN,
    profileCompleted: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });
  return User;
};