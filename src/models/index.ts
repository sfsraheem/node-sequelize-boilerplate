import { config, sequelize } from "../configs";
import OTPModel from "./otp.model";
import UserModel from "./user.model";

sequelize.sync({ alter: config.ENVIREMENT !== "production" }).then(() => {
  console.log("Database tables updated.");
});

export { OTPModel, UserModel };
