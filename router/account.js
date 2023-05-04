const Router = require("koa-router");
const account = new Router();
const tools = require("../utils/tools");

account.post("/auth/token", async (ctx, next) => {
  const { db } = ctx;
  const { code, data } = ctx.request.body;
  const weappData = await tools.getWeappOpenid(code);
  if (weappData) {
    const timestamp = Math.floor(Date.now() / 1000);
    const { session_key, openid } = weappData;
    const { nickName, avatarUrl, gender, language } = data.userInfo;
    const uuid = tools.generateUUID();
    // const accessToken = await tools.getAccessToken();
    // console.log("accessToken: ", accessToken);
    const tableFields = {
      user_id: `'${openid}'`,
      nickname: `'${nickName}'`,
      password: "'zihua22!'",
      // email,
      gender: `'${gender}'`,
      // age,
      avatar: `'${avatarUrl}'`,
      open_id: `'${openid}'`,
      session_key: `'${session_key}'`,
      uuid: `'${uuid}'`,
      create_time: timestamp,
      update_time: timestamp,
      last_login_time: timestamp,
    };
    await db.insert("account", tableFields);
    const payload = {
      user_id: openid,
      nickname: nickName,
    };
    const token = tools.generateToken(payload);
    const baseData = {
      status: true,
      msg: "用户登录成功",
      data: {
        avatar: avatarUrl,
        token: `Bearer ${token}`,
        ...payload,
      },
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
  } else {
    ctx.response.body = {
      status: false,
      msg: "用户登录失败",
      data: null,
    };
  }
});

account.get("/auth/weapp-token", async (ctx, next) => {
  try {
    const accessToken = await tools.getAccessToken();
    console.log("accessToken: ", accessToken);
    const baseData = {
      status: true,
      msg: "success",
      data: accessToken,
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
  } catch (err) {
    ctx.response.body = {
      status: false,
      msg: err,
      data: null,
    };
  }
});
// account.post("/auth/token", async (ctx, next) => {
//   const { db } = ctx;
//   const { code, avatarUrl } = ctx.request.body;
//   const data = await tools.weappLogin(code);
//   if (data) {
//     const timestamp = Math.floor(Date.now() / 1000);
//     const { session_key, openid } = data;
//     const uuid = tools.generateUUID();
//     const accessToken = await tools.getAccessToken();
//     console.log("accessToken: ", accessToken);
//     const tableFields = {
//       user_id: `'${"phone"}'`,
//       // nickname,
//       password: "'zihua22!'",
//       // email,
//       // gender,
//       // age,
//       // avatar:"../public/images/avatar/my-avatar.png",
//       open_id: `'${openid}'`,
//       session_key: `'${session_key}'`,
//       uuid: `'${uuid}'`,
//       create_time: timestamp,
//       update_time: timestamp,
//       last_login_time: timestamp,
//     };
//     await db.insert("account", tableFields);
//     const payload = {
//       openid,
//     };
//     const token = tools.generateToken(payload);
//     const baseData = {
//       msg: "用户登录成功",
//       data: token,
//     };
//     ctx.response.body = baseData;
//     const extraData = {
//       code: ctx.response.status,
//     };
//     ctx.response.body = { ...baseData, ...extraData };
//   } else {
//     ctx.response.body = {
//       code: 500,
//       msg: "用户登录失败",
//       data: null,
//     };
//   }
// });

account.post("/weapp-login", async (ctx, next) => {
  const { db } = ctx;
  const { code, avatarUrl } = ctx.request.body;
  const data = await tools.weappLogin(code);
  if (data) {
    const timestamp = Math.floor(Date.now() / 1000);
    const { session_key, openid } = data;
    const uuid = tools.generateUUID();
    // const accessToken = await tools.getAccessToken();
    // console.log("accessToken: ", accessToken);
    const tableFields = {
      user_id: `'${"phone"}'`,
      // nickname,
      password: "'zihua22!'",
      // email,
      // gender,
      // age,
      // avatar:"../public/images/avatar/my-avatar.png",
      open_id: `'${openid}'`,
      session_key: `'${session_key}'`,
      uuid: `'${uuid}'`,
      create_time: timestamp,
      update_time: timestamp,
      last_login_time: timestamp,
    };
    await db.insert("account", tableFields);
    const payload = {
      openid,
    };
    const token = tools.generateToken(payload);
    const baseData = {
      msg: "用户登录成功",
      data: token,
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
  } else {
    ctx.response.body = {
      code: 500,
      msg: "用户登录失败",
      data: null,
    };
  }
});

// 在这里定义accountRouter的路由和中间件
account.get("/:id", (ctx) => {
  const { id } = ctx.params;
  console.log("当前查询用户的id111：" + id);
  ctx.response.body = [{ id: 1, name: "测试用户" }];
});

// 处理 MySQL 查询请求
account.get("/user-info/:id", async (ctx, next) => {
  const { db, params } = ctx;
  const { id } = params;
  try {
    const res = await db.query("select * from account where id = ?", [id]);
    if (res) {
      // // 设置响应头
      // ctx.set("Connection", "keep-alive");
      // ctx.response.status = 409;
      const baseData = {
        msg: "获取用户信息成功",
        data: res[0],
      };
      ctx.response.body = baseData;
      const extraData = {
        code: ctx.response.status,
      };
      ctx.response.body = { ...baseData, ...extraData };
    } else {
      ctx.response.body = {
        code: 200,
        msg: "获取用户信息失败",
        data: null,
      };
    }
    await next();
  } catch (error) {
    ctx.throw(500, error);
  }
});

module.exports = account;
