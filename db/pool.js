import { Pool } from "pg";

const isProduction = (process.env.APP_ENV || "").toLowerCase() === "production";

if (!isProduction) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

export const CONNECTION_SETTINGS = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.NAME,
  ssl: isProduction ? true : false,
};

export default new Pool(CONNECTION_SETTINGS);
