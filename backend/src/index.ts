import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';

import cors from 'cors';
import loginRouter from './login/login.controller';


import MongooseError from './mongo.connection';


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

  app.use('/login', loginRouter);

  app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello from Express + TypeScript!' });
  });

  app.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}`);
  });
}

main();