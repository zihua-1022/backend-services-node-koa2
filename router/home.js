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
  const { db } = ctx;
  console.log("ctx: ", ctx);
  try {
    const res = await db.query("select * from image where is_recommend = ?", [
      1,
    ]);
    if (res) {
      console.log("res: ", res);
      // // 设置响应头
      // ctx.set("Connection", "keep-alive");
      // ctx.response.status = 409;
      const baseData = {
        status: true,
        msg: "获取今日推荐成功",
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
        msg: "获取今日推荐失败",
        data: null,
      };
    }
    await next();
  } catch (err) {
    console.log("err: ", err);
    ctx.throw(500, "Internal Server Error");
  }
});

home.get("/image-popular", async (ctx, next) => {
  const { db } = ctx;
  console.log("ctx: ", ctx);
  try {
    const res = await db.query("select * from image where is_hot = ?", [1]);
    if (res) {
      console.log("res: ", res);
      // // 设置响应头
      // ctx.set("Connection", "keep-alive");
      // ctx.response.status = 409;
      const baseData = {
        status: true,
        msg: "获取今日热门成功",
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
        msg: "获取今日热门失败",
        data: null,
      };
    }
    await next();
  } catch (err) {
    console.log("err: ", err);
    ctx.throw(500, "Internal Server Error");
  }
});

module.exports = home;
