// const mysql2 = require("mysql2/promise");
const { Sequelize } = require("sequelize");

// // 创建MySQL连接池
// const pool = mysql2.createPool({
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE,
//   waitForConnections: true,
//   connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, // 最多支持10个连接
//   queueLimit: 0, // 连接请求将不会排队等待连接，而是立即返回一个错误
// });

const baseConfig = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  dialect: process.env.DB_DATABASE_TYPE, //数据库类型
};

const poolConfig = {
  max: 10, // 最大连接数
  min: 0, // 最小连接数
  acquire: 30000, // 获取连接的超时时间（毫秒）
  idle: 10000, // 连接闲置的超时时间（毫秒）
};

// 创建 Sequelize 实例
const sequelize = new Sequelize({
  ...baseConfig,
  pool: poolConfig,
});

module.exports = sequelize;
