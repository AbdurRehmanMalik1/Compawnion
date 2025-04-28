import mongoose from 'mongoose';

export interface UserModel extends Document {
    name: string;
    email: string;
    password: string;
}


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    // age: {
    //     type: Number,
    //     required: false
    // },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model('User', userSchema);


export default User;