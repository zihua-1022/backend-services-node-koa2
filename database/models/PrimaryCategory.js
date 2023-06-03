const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例
const config = require("./config");

class PrimaryCategory extends Model {}

PrimaryCategory.init(
  {
    mid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    cTitle: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "c_title",
    },
    cDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "c_desc",
    },
  },
  {
    sequelize,
    modelName: "PrimaryCategory",
    tableName: "primary_category",
    ...config,
  }
);

module.exports = PrimaryCategory;
