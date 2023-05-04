const Router = require("koa-router");
const router = new Router();

router.get("/home", (ctx, next) => {
  let id = ctx.query.id;
  console.log("当前查询用户的i232323d：" + id);
  ctx.response.body = [{ id: 1, name: "测试用户" }];
});
router.post("/home", (ctx, next) => {
  let name = ctx.request.body.name;
  console.log("当前操作用户：" + name);
  ctx.response.body = "创建用户";
});

router.get("/users", (ctx, next) => {
  let id = ctx.query.id;
  console.log("当前查询用户的id：" + id);
  ctx.response.body = [{ id: 1, name: "测试用户" }];
});
router.post("/users", (ctx, next) => {
  let name = ctx.request.body.name;
  console.log("当前操作用户：" + name);
  ctx.response.body = "创建用户";
});

module.exports = router;
