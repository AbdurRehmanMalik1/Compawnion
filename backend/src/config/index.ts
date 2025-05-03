import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || "5000",
  mongoUrl: process.env.MONGO_URL || "undefined",
  email: {
    service: "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL_ACCOUNT as string,
      pass: process.env.GOOGLE_EMAIL_PASS as string,
    },
    defaultFrom: "Compawnion Support Team",
  },
  otp: {
    expiresIn: 10,
  },
};

export type Config = typeof config;

export { config };
