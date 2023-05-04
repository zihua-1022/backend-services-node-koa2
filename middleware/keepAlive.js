// 中间件设置响应头
const mKeepAlive = async (ctx, next) => {
  ctx.set("Connection", "keep-alive");
  await next();
};

module.exports = mKeepAlive;
