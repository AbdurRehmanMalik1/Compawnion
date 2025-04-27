import dotenv from 'dotenv';
dotenv.config();
import mongoose from "mongoose";

let MongooseError: string | null = '';
const mongoURL = process.env.MONGO_URL || 'undefined';

console.log('Trying to Connect Mongo Db at ', mongoURL)
mongoose.connect(mongoURL)
    .then((message) => {
        MongooseError = null;
    })
    .catch((err) => {
        MongooseError = err;
    });


export default MongooseError;