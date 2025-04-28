import { userService } from "../user/user.service"
import { hash as bcryptHash } from 'bcrypt';


export const signupService = {
    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPassword = await bcryptHash(password, saltRounds);
        return hashedPassword;
    },
    async signUp(name: string, email: string, password: string): Promise<any> {
        const hashedPassword = await this.hashPassword(password);
        return await userService.createUser(name, email, hashedPassword);
    }
}