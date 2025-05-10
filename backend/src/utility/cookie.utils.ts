import { CookieOptions } from "express";
import { config } from "../config";

export const getCookieOptions = (): CookieOptions => {
  return {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    sameSite: "none",
    secure: true,
  };
};
