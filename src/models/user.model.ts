import { DataTypes, Model } from "sequelize";
import { config, sequelize } from "../configs";
import { User_Roles } from "../enums";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserModel extends Model {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  verified: boolean;
  comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };

  createJWT = async function () {
    return jwt.sign({ userId: this._id }, config.JWT_SECRET, {
      expiresIn: config.JWT_LIFETIME,
    });
  };
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM,
      values: Object.values(User_Roles),
      defaultValue: User_Roles.USER,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "users",
    tableName: "users",
  }
);

UserModel.beforeSave(async (user, options) => {
  if (user.changed("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

export default UserModel;
