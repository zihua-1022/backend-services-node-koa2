const Koa = require("koa");
var bodyParser = require("koa-bodyparser");
const router = require("./router/index");
const app = new Koa();
app.use(bodyParser());

app
  .use(router.routes()) // 启动路由
  .use(router.allowedMethods());

app.listen(5000, () => {
  console.log("服务器启动，地址：http://127.0.0.1:5000");
});
