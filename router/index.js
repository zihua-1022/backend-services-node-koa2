const Router = require("koa-router");
const fs = require("fs");
const path = require("path");
const router = new Router();

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

const autoImportRouter = () => {
  // 获取当前文件所在的目录
  const routersDir = path.join(__dirname);
  // 读取 router 目录中除index.js和非js外的所有文件
  const files = fs
    .readdirSync(routersDir)
    .filter((file) => file !== "index.js" && file.endsWith(".js")); // file.endsWith(".js")判断文件类型是否为 js
  // 遍历目录下的所有路由文件
  files.forEach((file) => {
    const filePath = path.join(routersDir, file);
    // 获取一个路径中的文件名（不包含扩展名）
    const fileName = path.basename(filePath, ".js");
    // 导入模块路由
    const subRouter = require(filePath);
    // 注册路由级组件/模块路由
    router.use(`/${fileName}`, subRouter.routes(), subRouter.allowedMethods());
  });
};

autoImportRouter();

module.exports = router;
