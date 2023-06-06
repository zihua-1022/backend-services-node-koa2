const Account = require("./Account");
const Image = require("./Image");
const Category = require("./Category");
const ImageCategory = require("./ImageCategory");
const MainCategory = require("./MainCategory");
const CategoryRelation = require("./CategoryRelation");

// 设置关联
Image.belongsToMany(Category, {
  through: ImageCategory,
  foreignKey: "image_id",
  otherKey: "category_id",
});
Category.belongsToMany(Image, {
  through: ImageCategory,
  foreignKey: "category_id",
  otherKey: "image_id",
});

MainCategory.belongsToMany(Category, {
  through: CategoryRelation,
  foreignKey: "mid",
  otherKey: "cid",
});
Category.belongsToMany(MainCategory, {
  through: CategoryRelation,
  foreignKey: "cid",
  otherKey: "mid",
});

module.exports = {
  Account,
  Image,
  Category,
  ImageCategory,
  MainCategory,
  CategoryRelation,
};
