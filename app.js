const Koa = require("koa");
const cors = require("@koa/cors");
const { koaBody } = require("koa-body");
const bodyParser = require("koa-bodyparser");
const staticServe = require("koa-static");
const dotenv = require("dotenv");
const path = require("path");
// 加载环境变量配置文件
dotenv.config();

const db = require("./database");
const dbModels = require("./database/models");
const router = require("./router");
const mKeepAlive = require("./middleware/keepAlive");

const hostname = process.env.APP_HOST;
const port = process.env.APP_PORT;
const app = new Koa();

app.context.db = db; // 挂载db到app全局
app.context.db.models = dbModels;
console.log(path.join(__dirname, "public/images/wallpaper/mobile"));
app.use(
  koaBody({
    multipart: true,
    formidable: {
      uploadDir: process.env.FILE_UPLOAD_DIR, // 指定上传文件的临时目录
      keepExtensions: true, // 保留文件扩展名
    },
  })
);
app.use(bodyParser());
app.use(
  cors({
    origin: "*",
    // credentials: true, // 允许发送cookies
    allowMethods: ["GET", "POST", "PUT", "DELETE"],
    allowHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);
app.use((ctx, next) => mKeepAlive(ctx, next));

// 处理静态资源请求
app.use(staticServe(path.join(__dirname, "public")));
app
  .use(router.routes()) // 启动路由 注册应用级组件
  .use(router.allowedMethods());

app.listen(port, () => {
  console.log(`Koa server listening on http://${hostname}:${port}`);
});
