import express, { Request, Response, Router } from 'express';
import { loginService } from './login.service';
import HttpExceptions from '../utility/exceptions/HttpExceptions';

const loginRouter: Router = express.Router();

// loginRouter.get('/', (req: Request, res: Response) => {
//     const data: string = 'Bro';

// });

loginRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    if(!req.body)
        throw HttpExceptions.BadRequest('Missing Login Details');

    const { email, password }: { email: string, password: string } = req.body;

    if (!email || !email.trim()) {
        throw HttpExceptions.BadRequest('Missing Email');
    }
    if (!password || !password.trim()) {
        throw HttpExceptions.BadRequest('Missing Password');
    }
    const message = await loginService.login(email, password);

    return res.status(200).json({ message })
});

export default loginRouter;
