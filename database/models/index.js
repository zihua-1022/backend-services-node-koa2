const Account = require("./Account");
const Image = require("./Image");
const ImageCategory = require("./ImageCategory");
const PrimaryCategory = require("./PrimaryCategory");

// 设置关联
Image.belongsToMany(PrimaryCategory, {
  through: ImageCategory,
  foreignKey: "image_id",
  otherKey: "category_id",
});
PrimaryCategory.belongsToMany(Image, {
  through: ImageCategory,
  foreignKey: "category_id",
  otherKey: "image_id",
});

module.exports = {
  Account,
  Image,
  ImageCategory,
  PrimaryCategory,
};
