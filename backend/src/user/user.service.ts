import User from "./user.model";



export const userService = {
    async createUser(name: string, email: string, password: string): Promise<any> {
        const testUser = new User({
            name,
            email,
            password,
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