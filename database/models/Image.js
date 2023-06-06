const { Model, DataTypes } = require("sequelize");
const sequelize = require("../index"); // 导入之前创建的 Sequelize 实例
const config = require("./config");

class Image extends Model {}

Image.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    imgName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "img_name",
    },
    imgDesc: {
      type: DataTypes.STRING,
      field: "img_desc",
    },
    imgType: {
      type: DataTypes.STRING,
      field: "img_type",
    },
    imgSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "img_size",
    },
    imgResolution: {
      type: DataTypes.STRING,
      field: "img_resolution",
    },
    imgTags: {
      type: DataTypes.STRING,
      field: "img_tags",
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isHot: {
      type: DataTypes.TINYINT,
      field: "is_hot",
    },
    isRecommend: {
      type: DataTypes.TINYINT,
      field: "is_recommend",
    },
    isPrimary: {
      type: DataTypes.TINYINT,
      field: "is_primary",
    },
    isPhone: {
      type: DataTypes.TINYINT,
      field: "is_phone",
    },
  },
  {
    sequelize,
    modelName: "Image",
    tableName: "image",
    ...config,
  }
);

module.exports = Image;
