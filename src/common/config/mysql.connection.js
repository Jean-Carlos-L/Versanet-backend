import { createPool } from "mysql2/promise";
import {
  MYSQL_HOST,
  MYSQL_DATABASE,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_USER,
} from "../constants/constants.js";

export const pool = createPool({
  host: MYSQL_HOST,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD,
  database: MYSQL_DATABASE,
  port: parseInt(MYSQL_PORT),
  connectionLimit: 10,
});
