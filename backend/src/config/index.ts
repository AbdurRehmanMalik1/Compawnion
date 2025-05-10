import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || "5000",
  mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/compawion",
  cors: {
    origin: true, // Allow all origins for now
  },
  email: {
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: {
      user: process.env.GOOGLE_EMAIL_ACCOUNT as string,
      pass: process.env.GOOGLE_EMAIL_PASS as string,
    },
    defaultFrom: process.env.EMAIL_FROM || "noreply@compawion.com",
  },
  otp: {
    expiresIn: 10, // minutes
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "7d", // 7 days
  },
};

export type Config = typeof config;

export { config };
