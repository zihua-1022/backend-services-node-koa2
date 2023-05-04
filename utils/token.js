const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// 使用 SHA256 哈希函数将字符串密钥转换成符合 AES 要求的密钥
const SECRET_KEY = crypto
  .createHash("sha256")
  .update(process.env.TOKEN_SECRET)
  .digest()
  .slice(0, 32);
const AES_ALGORITHM = process.env.AES_ALGORITHM;
console.log(SECRET_KEY.toString("hex"));

// AES 加密算法，对 session_key 和 openid 进行加密
function AESEncrypt(data) {
  const iv = crypto.randomBytes(16); // generate a 16-byte initialization vector
  const cipher = crypto.createCipheriv(AES_ALGORITHM, SECRET_KEY, iv);
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return `${iv.toString("base64")}.${encrypted}`;
  // return encrypted;
}

// AES解密函数
function AESEecrypt(data) {
  const [iv, encrypted] = data.split(".");
  const decipher = crypto.createDecipheriv(
    AES_ALGORITHM,
    SECRET_KEY,
    Buffer.from(iv, "base64")
  );
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// 签名函数
function sign(data) {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  return hmac.digest("hex");
}

// 验证函数
function verify(data, signature) {
  const hmac = crypto.createHmac("sha256", SECRET_KEY);
  hmac.update(data);
  const digest = hmac.digest("hex");
  return signature === digest;
}

const generateToken = (payload, ...config) => {
  const data = JSON.stringify(payload);
  const encryptedPayload = AESEncrypt(data);
  const signature = sign(encryptedPayload);
  const token = `${encryptedPayload}.${signature}`;
  console.log("token: ", token);
  return token;
};

const verifyToken = (token) => {
  // 验证 token
  const [iv, encrypted, signature] = token.split(".");
  const encryptedPayload = `${iv}.${encrypted}`;
  const isValid = verify(encryptedPayload, signature);
  const decryptData = AESEecrypt(encryptedPayload);
  const data = JSON.parse(decryptData);
  console.log("data: ", data);
};
module.exports = {
  generateToken,
  verifyToken,
};

// // 验证有效期是否过期
// if (exp < Math.floor(Date.now() / 1000)) {
//   // token 已过期
// }
