import express, { Request, Response } from 'express';
import { loginService } from './login.service'
export const loginRouter = express.Router();

loginRouter.post('/', (req: Request, res: Response) => {
    //some logic
    const data: string = 'Bro';
    loginService.login(data);
});