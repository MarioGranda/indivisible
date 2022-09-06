import mysql, { Pool } from "mysql2/promise";

let pool: Promise<Pool>;

const createPool = async () => {
  const connection = {
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER ?? "",
    password: process.env.DB_PASSWORD ?? "",
    host: process.env.DB_HOST ?? "",
    dbname: process.env.DB_DATABASE ?? "",
  };

  return mysql.createPool({
    host: connection.host,
    user: connection.username,
    password: connection.password,
    port: connection.port,
    database: connection.dbname,
    connectionLimit: Number(process.env.POOL_CONNECTION_LIMIT ?? 8),
  });
};

export const getPool = async (): Promise<Pool> => {
  if (!pool) {
    pool = createPool();
  }

  return pool;
};
