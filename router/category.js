const Router = require("koa-router");
const category = new Router();
const { Op } = require("sequelize");
const { objArrDistinct } = require("../utils/tools");

category.get("/image", async (ctx, next) => {
  try {
    const { db, query } = ctx;
    const { cid, page, pageSize, ...params } = query;
    const { Image, Category, ImageCategory } = db.models;
    let offset = 0;
    let limit = 11;
    if (page && pageSize) {
      offset = +page * pageSize;
      limit = +pageSize;
    }
    const imageCategoryData = await ImageCategory.findAll({
      where: {
        category_id: cid,
      },
      attributes: {
        exclude: ["category_id"],
      },
      raw: true, // 获取原始查询结果
    });
    const imageIds = [];
    imageCategoryData.forEach((i) => {
      imageIds.push(i.image_id);
    });
    const queryParams = {
      where: {
        ...params,
        id: {
          [Op.in]: imageIds,
        },
      },
      order: [
        // 将返回 `createdAt` DESC
        ["createdAt", "DESC"],
      ],
      limit,
      offset,
      raw: true, // 获取原始查询结果
    };
    const { count, rows } = await Image.findAndCountAll(queryParams);
    const categoryData = await Category.findOne({
      where: {
        cid,
      },
      raw: true, // 获取原始查询结果
    });
    const imagesData = rows.map((i) => {
      return {
        ...i,
        cid: categoryData.cid,
        categoryName: categoryData.categoryName,
      };
    });
    // const queryParams = {
    //   where: {
    //     ...params,
    //     // "$Categories.cid$": { [Op.eq]: cid },
    //   },
    //   include: {
    //     model: Category,
    //     where: {
    //       cid,
    //     },
    //     // required: false,
    //     attributes: [],
    //     through: {
    //       attributes: [],
    //     },
    //   },
    //   limit,
    //   offset,
    //   raw: true, // 获取原始查询结果
    // };
    const baseData = {
      status: true,
      msg: "获取图片成功",
      data: {
        total: count,
        value: imagesData,
      },
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

category.get("/image-tabs", async (ctx, next) => {
  try {
    const { db, query } = ctx;
    const { mid, ...params } = query;
    const { Image, Category, MainCategory } = db.models;
    const queryParams = {
      where: {
        ...params,
        isPrimary: 1,
      },
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
    const queryParamsByMid = {
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
    const imagesData = await Image.findAll(
      mid ? queryParamsByMid : queryParams
    );

    const tabsData = mid ? objArrDistinct(imagesData, "cid") : imagesData;
    const baseData = {
      status: true,
      msg: "获取图片分类成功",
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

category.get("/single/:mid", async (ctx, next) => {
  try {
    const { db } = ctx;
    const mid = ctx.params.mid;
    const { MainCategory, Category } = db.models;
    const queryParams = {
      where: {
        "$MainCategories.mid$": { [Op.eq]: mid },
      },
      include: {
        model: MainCategory,
        attributes: [],
        through: {
          attributes: [],
        },
      },
    };
    const categoryData = await Category.findAll(queryParams);
    if (categoryData) {
      const baseData = {
        status: true,
        msg: "获取图片类别成功",
        data: categoryData,
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
    ctx.throw(500, "Internal Server Error");
  }
});

category.get("/all", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { MainCategory, Category } = db.models;
    const queryParams = {
      // include: {
      //   model: Category,
      //   attributes: ["cid", "categoryName"],
      //   through: {
      //     attributes: [],
      //   },
      // },
    };
    const categoryData = await Category.findAll(queryParams);
    if (categoryData) {
      const baseData = {
        status: true,
        msg: "获取图片成功",
        data: categoryData,
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

module.exports = category;
