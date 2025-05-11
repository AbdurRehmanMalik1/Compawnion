import { CookieOptions } from "express";
import { config } from "../config";

export const getCookieOptions = (): CookieOptions => {
  return {
    path: "/",
    httpOnly: true,  // Makes the cookie inaccessible to JavaScript
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    sameSite: "none", // Required for cross-site requests
    secure: true,     // Only sent over HTTPS
  };
};