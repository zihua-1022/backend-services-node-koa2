const Koa = require("koa");
const static = require("koa-static");
const path = require("path");
const app = new Koa();

const one = (ctx, next) => {
  console.log(">> one");
  next();
  console.log("<< one");
};
const two = (ctx, next) => {
  console.log(">> two");
  next();
  console.log("<< two");
};
const three = (ctx, next) => {
  console.log(">> three");
  // // next();
  // >> one
  // >> three
  // << three
  // << one

  console.log("<< three");
};
app.use(one);
app.use(three);
app.use(two);
// >> one
// >> three
// >> two
// << two
// << three
// << one
app.use(static(path.join(__dirname + "/public")));
app.listen(5001, () => {
  console.log("服务器启动，地址：http://127.0.0.1:5001");
});
