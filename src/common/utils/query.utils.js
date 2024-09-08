import { pool } from "../config/mysql.connection.js";

export const query = async (sql, params) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows;
  } catch (error) {
    throw error;
  } finally {
    connection.release();
  }
};
