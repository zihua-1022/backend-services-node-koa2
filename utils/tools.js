const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const tokenSecret = process.env.TOKEN_SECRET;

// export const autoImportRouter = () => {
//   // 获取路由文件所在的目录
//   const routersDir = path.join(__dirname);
//   // 读取 router 目录中除index.js和非js外的所有文件
//   const files = fs
//     .readdirSync(routersDir)
//     .filter((file) => file !== "index.js" && file.endsWith(".js"));

//   // 遍历目录下的所有路由文件
//   files.forEach((file) => {
//     // // 判断文件类型是否为 js
//     // if (file.endsWith(".js")) {
//     const filePath = path.join(routersDir, file);
//     // 获取一个路径中的文件名（不包含扩展名）
//     const fileName = path.basename(filePath, ".js");
//     console.log("fileName: ", fileName);

//     // 导入模块路由
//     const subRouter = require(filePath);
//     // 注册路由级组件/模块路由
//     router.use(`/${fileName}`, subRouter.routes(), subRouter.allowedMethods());
//   });
// };

const generateUUID = () => {
  const uuid = uuidv4();
  return uuid;
};
const getWeappOpenid = async (code) => {
  const params = {
    appid: process.env.APP_ID,
    secret: process.env.APP_SECRET,
    js_code: code,
    grant_type: "authorization_code",
  };
  const response = await axios.get(
    "https://api.weixin.qq.com/sns/jscode2session",
    { params }
  );
  // const response = {
  //   status: 200,
  //   data: {
  //     session_key: "hCVLF3hF2HXTW4EKKBcRCA==",
  //     openid: "ocRlr5HGIb6m3zyTYjAPeS3A-eoU",
  //   },
  // };
  let res = null;
  if (response.status === 200) {
    res = response.data;
  }
  return res;
};
const getAccessToken = async () => {
  const params = {
    appid: process.env.APP_ID,
    secret: process.env.APP_SECRET,
    grant_type: "client_credential",
  };
  const response = await axios.get("https://api.weixin.qq.com/cgi-bin/token", {
    params,
  });
  let res = null;
  if (response.status === 200) {
    res = response.data;
  }
  return res;
};

const getWeappUserInfo = async () => {
  const { access_token, expires_in } = await getAccessToken();
  const data = {
    code: "",
  };
  const response = await axios.post(
    "https://api.weixin.qq.com/wxa/business/getuserphonenumber",
    data,
    {
      access_token,
    }
  );
  let res = null;
  if (response.status === 200) {
    res = response.data;
  }
  return res;
};

const generateToken = (payload, ...config) => {
  let tokenConfig = { expiresIn: `${process.env.TOKEN_EXPIRES}d` };
  config.forEach((item) => {
    tokenConfig = { ...tokenConfig, ...item };
  });
  const token = jwt.sign(payload, tokenSecret, tokenConfig); // 这里设置 token 的有效期为 3 天
  return token;
};

const verifyToken = (token, ...config) => {
  try {
    const decoded = jwt.verify(token, tokenSecret);
    return decoded;
  } catch (err) {
    console.error(err); // 验证失败
    return null;
  }
};

module.exports = {
  // weappLogin,
  getWeappOpenid,
  getAccessToken,
  generateToken,
  verifyToken,
  generateUUID,
};
