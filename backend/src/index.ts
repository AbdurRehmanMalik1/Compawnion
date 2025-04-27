import dotenv from 'dotenv';
dotenv.config();

import express, { NextFunction, Request, Response } from 'express';

import cors from 'cors';
import loginRouter from './login/login.controller';

import MongooseError from './mongo.connection';
import signUpRouter from './signup/signup.controller';
import HttpExecptions from './utility/exceptions/HttpError';


function main() {
  if (MongooseError !== null) {
    console.log(MongooseError);
  } else {
    return;
  }

  const app = express();
  const PORT: string = process.env.PORT || '3000';


  app.use(cors());
  app.use(express.json());
 

  app.use('/signup', signUpRouter);
  app.use('/login', loginRouter);

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Express + TypeScript!' });
  });

  //Make Sure this Handler is added at end.
  app.use(HttpExecptions.ExceptionHandler());
  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

main();