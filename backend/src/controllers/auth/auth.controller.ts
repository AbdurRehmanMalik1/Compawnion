import { Request, Response } from "express";
import { authService } from "./auth.service";
import HttpExceptions from "../../utility/exceptions/HttpExceptions";

async function signup(req: Request, res: Response): Promise<any> {
  if (!req.body) throw HttpExceptions.BadRequest("Missing Signup Details");

  const {
    name,
    email,
    password,
  }: { name: string; email: string; password: string } = req.body;

  if (!name || !name.trim()) {
    throw HttpExceptions.BadRequest("Missing/Invalid Name");
  }
  if (!email || !email.trim()) {
    throw HttpExceptions.BadRequest("Missing/Invalid Email");
  }
  if (!password || !password.trim()) {
    throw HttpExceptions.BadRequest("Missing/Invalid Password");
  }
  const user = await authService.signUp(name, email, password);

  return res.status(200).json({ message: "Signup Successful", user: user });
}

async function login(req: Request, res: Response): Promise<any> {
  if (!req.body) throw HttpExceptions.BadRequest("Missing Login Details");

  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !email.trim()) {
    throw HttpExceptions.BadRequest("Missing Email");
  }
  if (!password || !password.trim()) {
    throw HttpExceptions.BadRequest("Missing Password");
  }
  const message = await authService.login(email, password);

  return res.status(200).json({ message });
}

export const authController = {
  signup,
  login,
};
