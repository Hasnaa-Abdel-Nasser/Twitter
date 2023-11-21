import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
}).promise();

try {
  await pool.connect();
  console.log("Connected to MySQL database");
} catch (err) {
  console.error("Error connecting to MySQL database:", err);
}

export default pool;
