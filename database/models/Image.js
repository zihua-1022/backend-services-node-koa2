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
      defaultValue: "无",
    },
    imgResolution: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "img_resolution",
    },
    imgSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "img_size",
    },
    dSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "d_size",
    },
    path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dPath: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "d_path",
    },
    imgProperty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "img_property",
    },
    isRecommend: {
      type: DataTypes.TINYINT,
      field: "is_recommend",
      defaultValue: 0,
    },
    isPrimary: {
      type: DataTypes.TINYINT,
      field: "is_primary",
      defaultValue: 0,
    },
    isHot: {
      type: DataTypes.TINYINT,
      field: "is_hot",
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "user_id",
    },
    imgColor: {
      type: DataTypes.STRING,
      field: "img_color",
      defaultValue: "#0f0f0f",
    },
    imgDesc: {
      type: DataTypes.STRING,
      field: "img_desc",
      defaultValue: "无",
    },
    imgTags: {
      type: DataTypes.STRING,
      field: "img_tags",
      defaultValue: "无",
    },
    imgType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "img_type",
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
