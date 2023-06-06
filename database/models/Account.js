const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例
const config = require("./config");

class Account extends Model {}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_id",
    },
    nickName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "nickname",
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    gender: {
      type: DataTypes.TINYINT,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    avatar: {
      type: DataTypes.STRING,
    },
    openId: {
      type: DataTypes.STRING,
      field: "open_id",
    },
    sessionKey: {
      type: DataTypes.STRING,
      field: "session_key",
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastLoginAt: {
      type: DataTypes.STRING,
      field: "last_login_at",
    },
  },
  {
    sequelize,
    modelName: "Account",
    tableName: "account",
    ...config,
  }
);

module.exports = Account;
