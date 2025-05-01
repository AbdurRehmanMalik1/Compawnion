import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { config } from "./config";

let MongooseError: string | null = "";

console.log("Trying to Connect Mongo Db at ", config.mongoUrl);
mongoose
  .connect(config.mongoUrl)
  .then((message) => {
    MongooseError = null;
  })
  .catch((err) => {
    MongooseError = err;
  });

export default MongooseError;
