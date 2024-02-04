import { DataTypes, Model } from "sequelize";
import { sequelize } from "../configs";
import { OTP_Reason } from "../enums";
import bcrypt from "bcrypt";

class OTPModel extends Model {
  otp: string;
  email: string;
  expiredAt: Date;
  reason: string;
  campareOtp = async function (otp: string) {
    return await bcrypt.compare(otp, this.otp);
  };
}

OTPModel.init(
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    otp: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiredAt: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    reason: {
      type: DataTypes.ENUM,
      values: Object.values(OTP_Reason),
      defaultValue: OTP_Reason.VERIFY_EMAIL,
    },
  },
  {
    sequelize,
    modelName: "otp",
    tableName: "otp",
  }
);

OTPModel.beforeCreate(async (otp, options) => {
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
});

export default OTPModel;