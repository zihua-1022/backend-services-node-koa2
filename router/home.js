const Router = require("koa-router");
const home = new Router();

// // 在这里定义accountRouter的路由和中间件
// home.get("/:id", (ctx) => {
//   const { id } = ctx.params;
//   console.log("当前查询用户的id123232：" + id);
//   ctx.response.body = [{ id: 1, name: "测试用户" }];
// });

// 处理 MySQL 查询请求
home.get("/testMysql/:id", async (ctx, next) => {
  const { db, params } = ctx;
  const { id } = params;
  console.log("id: ", id);
  try {
    const rows = await db.query("select * from account where id = ?", [id]);
    ctx.state.data = rows;
    ctx.response.body = rows[0];
    await next();
  } catch (error) {
    // console.error(error);
    ctx.throw(500, "Internal Server Error");
  }
});

home.get("/image-recommend", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { Image } = db.models;
    const queryParams = {
      where: {
        isRecommend: 1,
      },
    };
    const imagesData = await Image.findAll(queryParams);
    if (imagesData) {
      const baseData = {
        status: true,
        msg: "获取今日推荐成功",
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
        msg: "获取今日推荐失败",
        data: null,
      };
    }
    await next();
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

home.get("/image-popular", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { Image } = db.models;
    const queryParams = {
      where: {
        isHot: 1,
      },
    };
    const imagesData = await Image.findAll(queryParams);
    if (imagesData) {
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

module.exports = home;
