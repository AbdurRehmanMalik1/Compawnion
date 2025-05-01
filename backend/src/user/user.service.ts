import { MongoError } from "mongodb";
import User, { UserModel } from "../models/user.model";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import CustomMongoError from "../utility/exceptions/mongodb.exceptions";

export const userService = {
  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<any> {
    if (await this.findByEmail(email))
      throw HttpExceptions.Conflict("Email already in use");

    const testUser = new User({
      name,
      email,
      password,
    });
    try {
      const savedUser = await testUser.save();
      // console.log(savedUser);
      return savedUser;
    } catch (err) {
      if (
        err instanceof MongoError &&
        err.code === CustomMongoError.DuplicateKey
      ) {
        throw HttpExceptions.Conflict("Email already in use");
      }
      throw err;
    }
  },
  async findByEmail(email: string): Promise<UserModel | null> {
    return await User.findOne({ email: email });
  },
};
