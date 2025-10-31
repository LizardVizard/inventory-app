import { Pool } from "pg";

const isProduction = (process.env.APP_ENV || "").toLowerCase() === "production";

if (!isProduction) {
  const dotenv = await import("dotenv");
  dotenv.config();
}

export const CONNECTION_SETTINGS = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASSWORD,
  ssl: isProduction ? true : false,
};

export default new Pool(CONNECTION_SETTINGS);
