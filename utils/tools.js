const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const qiniu = require("qiniu");
const sharp = require("sharp");
const { Op } = require("sequelize");

const tokenSecret = process.env.TOKEN_SECRET;
const baseDir =
  process.env.NODE_ENV == "production"
    ? process.env.FILE_UPLOAD_DIR
    : process.env.DEV_FILE_UPLOAD_DIR;
const uploadDir = {
  0: "pc",
  1: "mobile/wallpaper",
  2: "mobile/avatar",
};

const categoryDir = {
  1: "conceptual-color",
  2: "anime",
  3: "cartoon",
  4: "character",
  5: "scenery",
  6: "hand-drawn",
  7: "cute-pet",
  8: "ancient-style",
  9: "text-wallpaper",
  10: "famous-locomotive",
  11: "photography",
  12: "sports",
  13: "film",
  14: "daily-moments",
  15: "boys",
  16: "girls",
  17: "lovers",
};

// 配置七牛云Access Key和Secret Key
const accessKey = "dfoxWNtBAlqByF2utqXHfLAPAlYUQJWImkoCcRXc";
const secretKey = "_uQH4JXPuum-AUvwc7fYBkEBVW-kwkesS5AEmZI1";

// 配置七牛云存储空间名称和域名
const bucket = "weapp-wallpaper";
// const domain = "http://cdn-m.zihua1022.icu";
// 初始化七牛云SDK
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config);
const putExtra = new qiniu.form_up.PutExtra();
// 生成上传凭证
const options = {
  // scope: `${bucket}:${key}`,
  scope: bucket,
  expires: 3600 * 24 * 30 * 12, // 1 day
};
const putPolicy = new qiniu.rs.PutPolicy(options);
const uploadToken = putPolicy.uploadToken(mac);

const uploadFileObjStorage = (buffer, filename, imageType, cid) => {
  const key = `${uploadDir[imageType]}/${categoryDir[cid]}/${filename}`;
  return new Promise((reslove, reject) => {
    // if (buffer.byteLength < 1024 * 1024) {
    formUploader.put(
      uploadToken,
      key,
      buffer,
      putExtra,
      function (respErr, respBody, respInfo) {
        if (respErr) {
          reject({
            msg: "error",
            code: respInfo.statusCode,
          });
        } else if (respInfo.statusCode == 200) {
          reslove(respBody);
        } else {
          reject({
            msg: respBody.error,
            code: respInfo.statusCode,
          });
        }
      }
    );
    // } else {
    // }
  });
};

const mergeUplaodFile = async (fileInfo) => {
  const { hash, totalCount, imageType, ...fileData } = fileInfo;
  const { path } = await merge(hash, totalCount, imageType);
  return path;
};

const uplaodChunkFile = async (file) => {
  const tempPath = file.filepath;
  const filename = file.originalFilename;
  let isExists = false;
  // 创建存放切片的临时目录
  const [, HASH] = /^([^_]+)_(\d+)/.exec(filename);
  const tempUploadDir = `${baseDir}/${HASH}`; // 用hash生成一个临时文件夹
  !fs.existsSync(tempUploadDir) ? fs.mkdirSync(tempUploadDir) : null; // 判断该文件夹是否存在，不存在的话，新建一个文件夹
  chunkFilepath = `${tempUploadDir}/${filename}`; // 将切片存到临时目录中
  isExists = await exists(chunkFilepath);
  if (isExists) {
    return "file is already exists";
  } else {
    const fileData = fs.readFileSync(tempPath);
    fs.writeFileSync(chunkFilepath, fileData);
    return "chunkFile is uploaded";
  }
};

const fileExists = async (dbModel, fileHash) => {
  const queryParams = {
    where: {
      path: { [Op.substring]: fileHash },
      // imgProperty: imageType,
    },
    raw: true, // 获取原始查询结果
  };
  const imageData = await dbModel.findOne(queryParams);
  return imageData ? true : false;
};

// 延迟函数
const delay = function (interval) {
  typeof interval !== "number" ? interval === 1000 : interval;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
};

// 检测文件是否已经存在
const exists = function (path) {
  return new Promise((resolve) => {
    fs.access(path, fs.constants.F_OK, (err) => {
      if (err) resolve(false);
      return resolve(true);
    });
  });
};

// 大文件上传 & 合并切片
const merge = (HASH, chunkCount, imageType) => {
  return new Promise(async (resolve, reject) => {
    const tempUploadDir = `${baseDir}/${HASH}`;
    // let fileList = [];
    let suffix = null;
    let isExists = await exists(tempUploadDir); // 判断文件是否存在
    if (!isExists) {
      reject("HASH path  is not found!");
      return;
    }
    const fileUploadDir = `${baseDir}/${uploadDir[imageType]}`;
    !fs.existsSync(fileUploadDir)
      ? fs.mkdirSync(fileUploadDir, { recursive: true })
      : null; // 判断该文件夹是否存在，不存在的话，新建一个文件夹
    const fileList = fs.readdirSync(tempUploadDir);
    if (fileList.length < chunkCount) {
      reject("the slice has not been uploaded!");
      return;
    }
    fileList
      .sort((a, b) => {
        let reg = /_(\d+)/;
        return reg.exec(a)[1] - reg.exec(b)[1];
      })
      .forEach((item) => {
        !suffix ? (suffix = /\.([0-9a-zA-Z]+)$/.exec(item)[1]) : null; // 处理文件后缀
        fs.appendFileSync(
          `${fileUploadDir}/${HASH}.${suffix}`,
          fs.readFileSync(`${tempUploadDir}/${item}`)
        );
        fs.unlinkSync(`${tempUploadDir}/${item}`);
      });
    fs.rmdirSync(tempUploadDir); // 删除临时文件夹
    resolve({
      path: `${uploadDir[imageType]}/${HASH}.${suffix}`,
      filename: `${HASH}.${suffix}`,
    });
  });
};

const writeFile = (path, file, filename, stream) => {
  return new Promise((resolve, reject) => {
    let fileData = null;
    if (stream) {
      fileData = fs.readFileSync(file.path);
    } else {
      fileData = file;
    }
    console.log("file: ", fileData);
    // 同步寫入文件
    fs.writeFile(`${path}/${filename}`, fileData, (err) => {
      if (err) {
        console.log("err: ", err);
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

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

const objArrDistinct = (objArr, key) => {
  const tempObj = {};
  const distinctData = objArr.reduce(function (item, next) {
    tempObj[next[key]] ? "" : (tempObj[next[key]] = true && item.push(next));
    return item;
  }, []);
  return distinctData;
};

module.exports = {
  uploadFileObjStorage,
  mergeUplaodFile,
  uplaodChunkFile,
  writeFile,
  fileExists,
  autoImportModules,
  // weappLogin,
  getWeappOpenid,
  getAccessToken,
  generateToken,
  verifyToken,
  generateUUID,
  objArrDistinct,
};
