const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例
const config = require("./config");
const MainCategory = require("./MainCategory");

class Category extends Model {}

Category.init(
  {
    cid: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "category_name",
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "category",
    ...config,
  }
);

module.exports = Category;
