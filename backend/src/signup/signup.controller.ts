import express, { NextFunction, Request, Response, Router } from 'express';
import { signupService } from './signup.service';
import HttpExecptions from '../utility/exceptions/HttpError';

const signUpRouter: Router = express.Router();

signUpRouter.post('/', (req: Request, res: Response): any => {
    const { name, email, password }: { name: string, email: string, password: string } = req.body;

    if (!name || !name.trim()) {
        throw HttpExecptions.BadRequest('Missing/Invalid Name');
    }
    if (!email || !email.trim()) {
        throw HttpExecptions.BadRequest('Missing/Invalid Email');
    }
    if (!password || !password.trim()) {
        throw HttpExecptions.BadRequest('Missing/Invalid Password');
    }

    return res.status(200).json({ message: 'Ok Sign up' });
});


export default signUpRouter;