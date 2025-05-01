import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import MongooseError from "./mongo.connection";
import HttpExecptions from "./utility/exceptions/HttpExceptions";
import routes from "./routes";

function main() {
  if (MongooseError !== null) {
    console.log(MongooseError);
  } else {
    return;
  }

  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Hello from Express + TypeScript!" });
  });

  app.use("/api", routes);

  //Make Sure this Handler is added at end.
  app.use(HttpExecptions.ExceptionHandler());
  app.listen(config.port, () => {
    console.log(`🚀 Server is running at http://localhost:${config.port}`);
  });
}

main();
