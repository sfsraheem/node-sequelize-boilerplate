import dotenv from "dotenv";
dotenv.config();

const config = {
  PORT: parseInt(process.env.PORT) || 4000,
  FRONT_END_URL: process.env.FRONT_END_URL || "*",
  ENVIREMENT: process.env.NODE_ENV || "development",
  JWT_SECRET: process.env.JWT_SECRET || "jwtSecret",
  JWT_LIFETIME: process.env.JWT_LIFETIME || "7d",
  DB_HOST: process.env.DB_HOST || "127.0.0.1",
  DB_NAME: process.env.DB_NAME || "postgres-ecommerce",
  DB_USERNAME: process.env.DB_USERNAME || "postgres",
  DB_PASSWORD: process.env.DB_PASSWORD || "root",
  DB_PORT: parseInt(process.env.DB_PORT) || 5432,
  PASSWORD: process.env.PASSWORD || "",
  FROM_EMAIL: process.env.FROM_EMAIL || "",
  FROM_EMAIL_ADDRESS: process.env.FROM_EMAIL_ADDRESS || "",
  FORGOT_PASSWORD_JWT_SECRET:
  process.env.FORGOT_PASSWORD_JWT_SECRET || "forgot password jwtSecret",
FORGOT_PASSWORD_JWT_LIFETIME:
  process.env.FORGOT_PASSWORD_JWT_LIFETIME || "5m",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || ""
};

export default config;
