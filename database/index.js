const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

// 加载环境变量配置文件
dotenv.config();

// 创建MySQL连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT || 10, // 最多支持10个连接
  queueLimit: 0, // 连接请求将不会排队等待连接，而是立即返回一个错误
});

async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    throw error;
    // return null;
  } finally {
    connection.release();
  }
}

async function insert(table, fields) {
  const fieldsArr = Object.keys(fields);
  const valuesArr = Object.values(fields);
  const connection = await pool.getConnection();
  const sql = `insert into ${table} (${fieldsArr.join(",")}) 
    values (${valuesArr.join(",")})`;
  try {
    const res = await connection.execute(sql);
    return res;
  } catch (error) {
    throw error;
    // return null;
  } finally {
    connection.release();
  }
}

module.exports = { query, insert };
