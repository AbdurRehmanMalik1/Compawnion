import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || "8000",
  mongoUrl: process.env.MONGO_URL || "undefined",
};

export type Config = typeof config;

export { config };
