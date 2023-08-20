const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const Router = require("koa-router");
const upload = new Router();
const tools = require("../utils/tools");

const resizeConfig = {
  0: { width: 1920, height: 1080 }, // 电脑分辨率
  1: { width: 1080, height: 1920 }, // 手机
  2: { width: 1080 }, // 头像
};

// TODO: 图片压缩处理以及图片是否已经存在等校验判断
upload.post("/file-cdn", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { Image } = db.models;
    const file = ctx.request.files.file; // 获取上传的文件对象
    const fileInfo = ctx.request.body;
    const { suffix, imageType, cid } = fileInfo;
    const [, HASH] = /^([^_]+)_(\d+)/.exec(file.originalFilename);
    // const filename = `${HASH}.${suffix}`;
    let data = null;
    let msg = "ok";
    let code = null;
    const isExists = await tools.fileExists(Image, HASH);
    if (isExists) {
      data = {
        hash: "",
        dHash: "",
        path: "",
        dPath: "",
      };
      code = 416;
      msg = "file is already exists";
    } else {
      const fileBuffer = fs.readFileSync(file.filepath);
      const originalData = await tools.uploadFileObjStorage(
        fileBuffer,
        `${HASH}.${suffix}`,
        imageType,
        cid
      );
      // let quality = null;
      // if (fileBuffer.byteLength < 1024 * 1024) {
      //   quality = 40;
      // } else if (fileBuffer.byteLength > 1024 * 1024) {
      //   quality = 25;
      // } else if (fileBuffer.byteLength > 3 * 1024 * 1024) {
      //   quality = 20;
      // } else if (fileBuffer.byteLength > 5 * 1024 * 1024) {
      //   quality = 15;
      // } else if (fileBuffer.byteLength > 8 * 1024 * 1024) {
      //   quality = 10;
      // }
      if (imageType != 2 && fileBuffer.byteLength > 1024 * 300) {
        let compressedBuffer = null;
        if (cid == 14) {
          compressedBuffer = await sharp(fileBuffer)
            .jpeg({
              quality: 50,
              mozjpeg: true,
            })
            .toBuffer();
        } else {
          compressedBuffer = await sharp(fileBuffer)
            .jpeg({
              quality: 65,
              mozjpeg: true,
            })
            .resize(resizeConfig[imageType])
            .toBuffer();
        }
        // fs.writeFileSync(`public/${file.originalFilename}`, compressedBuffer);
        const thumbData = await tools.uploadFileObjStorage(
          compressedBuffer,
          `${HASH}_thumb.${suffix}`,
          imageType,
          cid
        );
        data = {
          hash: thumbData.hash,
          dHash: originalData.hash,
          imgSize: compressedBuffer.byteLength,
          dSize: fileBuffer.byteLength,
          path: thumbData.key,
          dPath: originalData.key,
        };
      } else {
        data = {
          hash: originalData.hash,
          dHash: originalData.hash,
          imgSize: fileBuffer.byteLength,
          dSize: fileBuffer.byteLength,
          path: originalData.key,
          dPath: originalData.key,
        };
      }
    }
    const baseData = {
      status: true,
      msg,
      data,
    };
    ctx.response.body = baseData;
    const extraData = {
      code: code || ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
  } catch (err) {
    console.error("err: ", err);
    ctx.throw(500, "Internal Server Error");
  }
});

upload.post("/file-data", async (ctx, next) => {
  try {
    const { db } = ctx;
    const { Image, ImageCategory } = db.models;
    const fileInfo = ctx.request.body;
    if (fileInfo) {
      const { cid, ...fileData } = fileInfo;
      const tableFields = { ...fileData };
      const image = await Image.create(tableFields);
      const imageCategory = await ImageCategory.create({
        category_id: cid,
        image_id: image.id,
      });
      if (imageCategory) {
        const baseData = {
          status: true,
          msg: "上传文件成功",
          data: tableFields,
        };
        ctx.response.body = baseData;
        const extraData = {
          code: ctx.response.status,
        };
        ctx.response.body = { ...baseData, ...extraData };
      }
    } else {
      ctx.response.body = {
        status: false,
        code: 500,
        msg: "上传文件失败",
        data: null,
      };
    }
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

upload.post("/chunk-file", async (ctx, next) => {
  try {
    const file = ctx.request.files.file; // 获取上传的文件对象
    const msg = await tools.uplaodChunkFile(file);
    const baseData = {
      status: true,
      msg,
      data: "ok",
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

upload.post("/merge-file", async (ctx, next) => {
  try {
    const fileInfo = ctx.request.body;
    const path = await tools.mergeUplaodFile(fileInfo);
    const baseData = {
      status: true,
      msg: "合并文件成功",
      data: path,
    };
    ctx.response.body = baseData;
    const extraData = {
      code: ctx.response.status,
    };
    ctx.response.body = { ...baseData, ...extraData };
  } catch (err) {
    ctx.throw(500, "Internal Server Error");
  }
});

module.exports = upload;
