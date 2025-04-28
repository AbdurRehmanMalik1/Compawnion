import express, { Request, Response, Router } from 'express';
import { signupService } from './signup.service';
import HttpExceptions from '../utility/exceptions/HttpExceptions';

const signUpRouter: Router = express.Router();

signUpRouter.post('/', async (req: Request, res: Response): Promise<any> => {
    if(!req.body)
        throw HttpExceptions.BadRequest('Missing Signup Details');
    
    const { name, email, password }: { name: string, email: string, password: string } = req.body;

    if (!name || !name.trim()) {
        throw HttpExceptions.BadRequest('Missing/Invalid Name');
    }
    if (!email || !email.trim()) {
        throw HttpExceptions.BadRequest('Missing/Invalid Email');
    }
    if (!password || !password.trim()) {
        throw HttpExceptions.BadRequest('Missing/Invalid Password');
    }
    const user = await signupService.signUp(name, email, password);


    return res.status(200).json({ message: 'Signup Successful', user: user });
});


export default signUpRouter;