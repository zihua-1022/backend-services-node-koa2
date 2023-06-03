const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例

class ImageCategory extends Model {}

ImageCategory.init(
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
    modelName: "ImageCategory",
    tableName: "image_category",
    // underscored: false,
    timestamps: false,
  }
);

module.exports = ImageCategory;
