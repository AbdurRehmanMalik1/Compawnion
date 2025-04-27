import User from "./user.model";
import bcrypt from "bcrypt";



export const userService = {

    async hashPassword(password: string) {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    },

    async createUser(name: string, email: string, password: string): Promise<any> {
        const hashedPassword = await this.hashPassword(password);
        const testUser = new User({
            name,
            email,
            password: hashedPassword,
        });

        try {
            const savedUser = await testUser.save();
            console.log(savedUser);
            return { message: 'User added successfully', user: savedUser };
        } catch (err) {
            console.error('Error adding user:', err);
            return { message: 'Error adding user', error: err };
        }
        return name;
    }
}