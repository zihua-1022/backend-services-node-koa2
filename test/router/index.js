const Router = require("koa-router");
const router = new Router();

const requireDir = require("require-dir");

const routes = requireDir("./routes");

// 遍历 routes 对象，将其属性（router 实例）注册到主要的 router 实例中
for (const routeName in routes) {
  const route = routes[routeName];
  router.use(route.routes());
}

module.exports = router;

module.exports = router;
