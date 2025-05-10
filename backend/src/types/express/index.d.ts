import { UserModelI } from "../../models/user/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: UserModelI;
    }
  }
}
