const Router = require("koa-router");
const category = new Router();

category.get("/image", async (ctx, next) => {
  try {
    const { db, query } = ctx;
    const { Image, Category } = db.models;
    const queryParams = {
      where: query,
      attributes: {
        include: [
          [db.col("Categories.cid"), "cid"],
          [db.col("Categories.category_name"), "categoryName"],
        ],
      },
      include: {
        model: Category,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      raw: true, // 获取原始查询结果
    };
    const imagesData = await Image.findAll(queryParams);
    if (imagesData) {
      const baseData = {
        status: true,
        msg: "获取图片成功",
        data: imagesData,
      };
      ctx.response.body = baseData;
      const extraData = {
        code: ctx.response.status,
      };
      ctx.response.body = { ...baseData, ...extraData };
    } else {
      ctx.response.body = {
        code: 500,
        status: false,
        msg: "获取图片失败",
        data: null,
      };
    }
    await next();
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

category.get("/image-tabs", async (ctx, next) => {
  const { db } = ctx;
  console.log("ctx: ", ctx);
  try {
    const res = await db.query(
      "select * from image i,category c where i.category_id = c.id and i.is_primary = ?",
      [1]
    );
    if (res) {
      console.log("res: ", res);
      // // 设置响应头
      // ctx.set("Connection", "keep-alive");
      // ctx.response.status = 409;
      const baseData = {
        status: true,
        msg: "获取图片类别成功",
        data: res,
      };
      ctx.response.body = baseData;
      const extraData = {
        code: ctx.response.status,
      };
      ctx.response.body = { ...baseData, ...extraData };
    } else {
      ctx.response.body = {
        code: 500,
        status: false,
        msg: "获取图片类别失败",
        data: null,
      };
    }
    await next();
  } catch (err) {
    console.log("err: ", err);
    ctx.throw(500, "Internal Server Error");
  }
});

module.exports = category;
