const Router = require("koa-router");
const computer = new Router();
const { Op } = require("sequelize");

computer.get("/image-recommend", async (ctx, next) => {
  try {
    const { db, query } = ctx;
    const { Image, Category, MainCategory } = db.models;
    const { ...params } = query;
    const queryParams = {
      where: params,
      attributes: {
        include: [
          [db.col("Categories.MainCategories.mid"), "mid"],
          [db.col("Categories.MainCategories.c_title"), "cTitle"],
          [db.col("Categories.MainCategories.c_desc"), "cDesc"],
          [db.col("Categories.cid"), "cid"],
          [db.col("Categories.category_name"), "categoryName"],
        ],
      },
      include: {
        model: Category,
        // as: "primaryCategory",
        // required: true,
        attributes: [],
        // exclude: ["createdAt", "updatedAt"],
        // },
        through: {
          attributes: [],
        },
        include: {
          model: MainCategory,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      },
      // order: [
      //   // 将返回 `createdAt` DESC
      //   ["createdAt", "DESC"],
      // ],
      raw: true, // 获取原始查询结果
    };
    const imagesData = await Image.findAll(queryParams);
    const baseData = {
      status: true,
      msg: "获取PC推荐图片成功",
      data: imagesData,
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
    await next();
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

computer.get("/image-tabs", async (ctx, next) => {
  try {
    const { db, query } = ctx;
    const { mid, ...params } = query;
    const { Image, Category, MainCategory } = db.models;

    const queryParams = {
      where: {
        ...params,
        isPrimary: 1,
        "$Categories.MainCategories.mid$": { [Op.eq]: mid },
      },
      attributes: {
        include: [
          [db.col("Categories.MainCategories.mid"), "mid"],
          [db.col("Categories.MainCategories.c_title"), "cTitle"],
          [db.col("Categories.MainCategories.c_desc"), "cDesc"],
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
        include: {
          model: MainCategory,
          attributes: [],
          through: {
            attributes: [],
          },
        },
      },
      // order: [
      //   // 将返回 `createdAt` DESC
      //   ["createdAt", "DESC"],
      // ],
      raw: true, // 获取原始查询结果
    };
    const imagesData = await Image.findAll(queryParams);
    const tempObj = {};
    const tabsData = imagesData.reduce(function (item, next) {
      tempObj[next.cid] ? "" : (tempObj[next.cid] = true && item.push(next));
      return item;
    }, []);

    const baseData = {
      status: true,
      msg: "获取PC推荐图片成功",
      data: tabsData,
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
    await next();
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

computer.get("/image-popular", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { MainCategory, Image } = db.models;
    const queryParams = {
      where: {
        isHot: 1,
      },
      attributes: {
        include: [
          [db.col("PrimaryCategories.mid"), "mid"],
          [db.col("PrimaryCategories.c_title"), "cTitle"],
          [db.col("PrimaryCategories.c_desc"), "cDesc"],
        ],
      },
      include: {
        model: MainCategory,
        attributes: [],
        through: {
          attributes: [],
        },
      },
      raw: true, // 获取原始查询结果
    };
    const imagesData = await Image.findAll(queryParams);
    if (imagesData) {
      // // 设置响应头
      // ctx.set("Connection", "keep-alive");
      // ctx.response.status = 409;
      const baseData = {
        status: true,
        msg: "获取今日热门成功",
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
        msg: "获取今日热门失败",
        data: null,
      };
    }
    await next();
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

module.exports = computer;
