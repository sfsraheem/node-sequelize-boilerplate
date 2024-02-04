import { Sequelize } from "sequelize";
import config from "./config";

export const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USERNAME,
  config.DB_PASSWORD,
  {
    host: config.DB_HOST,
    dialect: "postgres",
    port: Number(config.DB_PORT),
    define: {
      timestamps: true,
    },
    logging: config.ENVIREMENT !== "production" 
  }
);

/* funcion for initiating Database connection */
export const initDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connection established...");
  } catch (e) {
    throw e;
  }
};
