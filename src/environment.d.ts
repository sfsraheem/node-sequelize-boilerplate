import { UserModel } from "./models";

declare global {
  namespace Express {
    interface Request {
      user?: UserModel;
    }
  }
}
