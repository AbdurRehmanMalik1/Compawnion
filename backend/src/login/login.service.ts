import { UserModel } from "../user/user.model";
import { userService } from "../user/user.service"
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import { compare as bcryptCompare } from 'bcrypt';

export const loginService = {
    async login(email: string, password: string): Promise<any> {
        const user: UserModel | null = await userService.findByEmail(email);
        if (!user)
            throw HttpExceptions.Unauthorized('Email does not exist');

        const isMatch: boolean = await bcryptCompare(password, user.password);

        if (!isMatch) {
            throw HttpExceptions.Unauthorized('Invalid Password');
        }
        return 'Login Successful';
    }
}