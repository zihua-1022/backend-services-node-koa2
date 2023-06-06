const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例
const config = require("./config");

class MainCategory extends Model {}

MainCategory.init(
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
    modelName: "MainCategory",
    tableName: "main_category",
    ...config,
  }
);

module.exports = MainCategory;
