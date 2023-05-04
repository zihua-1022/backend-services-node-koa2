const userRouter = require("./index");

userRouter.get("/users", (ctx, next) => {
  let id = ctx.query.id;
  console.log("当前查询用户的id" + id);
  ctx.response.body = [{ id: 1, name: "测试用户" }];
});
userRouter.post("/users", (ctx, next) => {
  let name = ctx.request.body.name;
  console.log("当前操作用户：" + name);
  ctx.response.body = "创建用户";
});

module.exports = userRouter;
