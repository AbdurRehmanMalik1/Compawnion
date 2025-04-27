import express, { Request, Response, Router } from 'express';
import { loginService } from './login.service';
import User from '../user/user.model';

const loginRouter: Router = express.Router();

loginRouter.get('/', (req: Request, res: Response) => {
    const data: string = 'Bro';
    
    loginService.login(data);
});

loginRouter.get('/testUser', async (req: Request, res: Response) => {
    const testUser = new User({
        name: 'John Doe',
        email: 'john.doe@example.com',
        password:'1234',
        age: 30,
    });

    try {
        const savedUser = await testUser.save();
        console.log(savedUser);
        res.status(201).json({ message: 'User added successfully', user: savedUser });
    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).json({ message: 'Error adding user', error: err });
    }
});

export default loginRouter;
