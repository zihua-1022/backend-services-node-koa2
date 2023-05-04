const path = require("path");
const fs = require("fs");
const Router = require("koa-router");
const staticServer = new Router();

// 处理图片请求
staticServer.get("/images/:filename", async (ctx) => {
  const filePath = path.join(__dirname, "images", ctx.params.filename);
  const file = await fs.promises.readFile(filePath);
  ctx.type = "image/jpeg"; // 设置响应头 Content-Type
  ctx.body = file;
});

// 处理视频请求
staticServer.get("/videos/:filename", async (ctx) => {
  const filePath = path.join(__dirname, "videos", ctx.params.filename);
  const file = await fs.promises.readFile(filePath);
  ctx.type = "video/mp4"; // 设置响应头 Content-Type
  ctx.body = file;
});

// // 处理 POST 请求
// router.post("/api", async (ctx) => {
//   const { url } = ctx.request.body;
//   // 使用 fetch 或 axios 等工具并行下载资源
//   // 返回下载后的资源路径或者错误信息
//   ctx.body = {
//     message: "下载成功！",
//     data: {
//       path: "/downloads/download.zip",
//     },
//   };
// });

module.exports = staticServer;
