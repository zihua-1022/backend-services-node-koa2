const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require("./router");
const db = require("./");
const staticServe = require("koa-static");
const path = require("path");
const fs = require("fs");

const app = new Koa();

// 处理静态资源请求
app.use(staticServe(path.join(__dirname, "public")));

// 处理图片请求
router.get("/images/:filename", async (ctx) => {
  const filePath = path.join(__dirname, "images", ctx.params.filename);
  const file = await fs.promises.readFile(filePath);
  ctx.type = "image/jpeg"; // 设置响应头 Content-Type
  ctx.body = file;
});

// 处理视频请求
router.get("/videos/:filename", async (ctx) => {
  const filePath = path.join(__dirname, "videos", ctx.params.filename);
  const file = await fs.promises.readFile(filePath);
  ctx.type = "video/mp4"; // 设置响应头 Content-Type
  ctx.body = file;
});

// 处理 POST 请求
router.post("/api", async (ctx) => {
  const { url } = ctx.request.body;
  // 使用 fetch 或 axios 等工具并行下载资源
  // 返回下载后的资源路径或者错误信息
  ctx.body = {
    message: "下载成功！",
    data: {
      path: "/downloads/download.zip",
    },
  };
});

// 处理 MySQL 查询请求
router.get("/testMysql/:id", async (ctx) => {
  const { id } = ctx.params;
  const rows = await db.query("select * from account where id = ?", [id]);
  console.log("当前查询的id：" + id, "rows: ", rows);
  ctx.body = rows[0];
});

app.use(bodyParser());
app
  .use(router.routes()) // 启动路由
  .use(router.allowedMethods());

app.listen(1022, () => {
  console.log("Koa server listening on http://localhost:1022");
});
