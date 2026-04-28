/**
 * lib/db.js
 *
 * Beginner-friendly MySQL helper for Next.js API routes.
 *
 * - Uses mysql2/promise (async/await)
 * - Uses a connection pool (recommended)
 * - Reuses the pool across hot reloads in dev
 */

import mysql from "mysql2/promise";

// In Next.js dev mode, the module can be reloaded many times.
// We store the pool on the global object to avoid creating too many connections.
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

/**
 * Run a SQL query safely with parameters.
 *
 * Example:
 *   const rows = await query('SELECT * FROM boards WHERE id = ?', [id])
 */
export async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}
