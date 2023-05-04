const pool = require("./index");

async function query(sql, params) {
  const connection = await pool.getConnection();
  try {
    const [rows, fields] = await connection.execute(sql, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { query };
