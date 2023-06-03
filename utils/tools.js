const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const tokenSecret = process.env.TOKEN_SECRET;

/**
 * @param fileDir {当前文件所在的目录}
 * @param unexpected {不期望导出的文件模块}
 */
const autoImportModules = (fileDir, unexpected) => {
  let fileModule = {};
  // 读取 fileDir 目录中除unexpected和非js外的所有文件
  const files = fs
    .readdirSync(fileDir)
    .filter((file) => !unexpected.includes(file) && file.endsWith(".js")); // file.endsWith(".js")判断文件类型是否为 js
  // 遍历目录下的所有路由文件
  files.forEach((file) => {
    const filePath = path.join(fileDir, file);
    // 获取一个路径中的文件名（不包含扩展名）
    const fileName = path.basename(filePath, ".js");
    fileModule = {
      ...fileModule,
      // 导入模块
      [fileName]: require(filePath),
    };
  });
  return fileModule;
};

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
  autoImportModules,
  // weappLogin,
  getWeappOpenid,
  getAccessToken,
  generateToken,
  verifyToken,
  generateUUID,
};
