
import mysql from "mysql2/promise";

const globalForMySQL = global;

export const pool =
  globalForMySQL.__taskboardPool ||
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForMySQL.__taskboardPool = pool;
}


export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
