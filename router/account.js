const Router = require("koa-router");
const account = new Router();
const moment = require("moment");
const tools = require("../utils/tools");

account.post("/auth/token", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { Account } = db.models;
    const { code, userInfo } = ctx.request.body;
    const weappData = await tools.getWeappOpenid(code);
    if (weappData) {
      // const timestamp = Math.floor(Date.now() / 1000);
      const date = new Date();
      // 获取当前时间( UTC协调世界时)并格式化为 datetime 格式
      const currentDateTime = date.toISOString().replace("T", " ").slice(0, 19);
      const { session_key, openid } = weappData;
      const { nickName, avatarUrl, gender, language } = userInfo;
      const uuid = tools.generateUUID();
      // const accessToken = await tools.getAccessToken();
      // console.log("accessToken: ", accessToken);
      const tableFields = {
        userId: openid,
        nickName: nickName,
        password: "zihua22!",
        // email,
        gender: gender,
        // age,
        avatar: avatarUrl,
        openId: openid,
        sessionKey: session_key,
        uuid: uuid,
        lastLoginAt: currentDateTime,
      };
      // 查找或创建用户
      const [user, created] = await Account.findOrCreate({
        where: { userId: openid },
        defaults: tableFields,
      });
      // if (created) {
      //   // 用户刚刚创建
      //   // ctx.body = { success: true, user };
      // } else {
      //   // 用户已存在
      //   // if (user.password === password) {
      //   //   ctx.body = { success: true, user };
      //   // } else {
      //   //   ctx.body = { success: false, message: '密码不正确' };
      //   // }
      // }
      const payload = {
        userId: openid,
        nickName: nickName,
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
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

account.get("/auth/weapp-token", async (ctx, next) => {
  try {
    const accessToken = await tools.getAccessToken();
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
