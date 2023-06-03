const path = require("path");
const Router = require("koa-router");
const router = new Router();
const { autoImportModules } = require("../utils/tools");

// 指定一个url匹配
router.get("/", async (ctx) => {
  ctx.type = "html";
  ctx.body = "<h1>hello world!</h1>";
});

// 统一加前缀
// router.prefix("/weapp");
// router.prefix('/weapp/:id')
// // 或者
// const router = new Router({
//   prefix: '/api'
// })
// router.redirect("/","/home") //重定向

const currentFileDir = path.join(__dirname);
const subRouters = autoImportModules(currentFileDir, ["index.js"]);
Object.keys(subRouters).forEach((fileName) => {
  const subRouter = subRouters[fileName];
  // 注册路由级组件/模块路由
  router.use(`/${fileName}`, subRouter.routes(), subRouter.allowedMethods());
});

module.exports = router;
