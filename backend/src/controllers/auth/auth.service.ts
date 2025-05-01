import { UserModel } from "../../models/user.model";
import { userService } from "../../user/user.service";
import HttpExceptions from "../../utility/exceptions/HttpExceptions";
import { compare as bcryptCompare } from "bcrypt";

async function signUp(
  name: string,
  email: string,
  password: string
): Promise<any> {
  return await userService.createUser(name, email, password);
}

async function login(email: string, password: string): Promise<any> {
  const user: UserModel | null = await userService.findByEmail(email);
  if (!user) throw HttpExceptions.Unauthorized("Email does not exist");

  const isMatch: boolean = await bcryptCompare(password, user.password);

  if (!isMatch) {
    throw HttpExceptions.Unauthorized("Invalid Password");
  }
  return "Login Successful";
}

export const authService = {
  signUp,
  login,
};
