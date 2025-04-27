import mongoose from "mongoose";

let MongooseError: string | null = '';
const mongoURL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/pet_app';

console.log('Trying to Connect Mongo Db at ', mongoURL)
mongoose.connect(mongoURL)
    .then((message) => {
        MongooseError = null;
    })
    .catch((err) => {
        MongooseError = err;
    });


export default MongooseError;