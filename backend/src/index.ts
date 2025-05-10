import express, { Request, Response } from "express";
import cors from "cors";
import { config } from "./config";
import { connectDB } from "./mongo.connection";
import HttpExecptions from "./utility/exceptions/HttpExceptions";
import routes from "./routes";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger.config";

function main() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Swagger Documentation
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.get("/", (_req: Request, res: Response) => {
    res.json({ message: "Hello from Express + TypeScript!" });
  });

  app.use("/api", routes);

  //Make Sure this Handler is added at end.
  app.use(HttpExecptions.ExceptionHandler());
  app.listen(config.port, () => {
    console.log(`🚀 Server is running at http://localhost:${config.port}`);
    connectDB();
  });
}

main();
