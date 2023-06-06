const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例

class CategoryRelation extends Model {}

CategoryRelation.init(
  {
    // id: {
    //   type: DataTypes.INTEGER,
    //   autoIncrement: true,
    //   primaryKey: true,
    //   allowNull: false,
    // },
  },
  {
    sequelize,
    modelName: "CategoryRelation",
    tableName: "category_relation",
    timestamps: false,
  }
);

module.exports = CategoryRelation;
