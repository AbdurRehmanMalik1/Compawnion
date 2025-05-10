import mongoose, { Document } from "mongoose";
import { UserRole } from "../../types";
import { ShelterData, shelterDataSchema } from "./shelter.data";
import { AdopterData, adopterDataSchema } from "./adopter.data";
import { VetData, vetDataSchema } from "./vet.data";
import bcrypt from "bcrypt";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { config } from "../../config";

export interface UserModelI extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole | null;
  roleData: ShelterData | AdopterData | VetData | Record<string, never>;
  avatar?: string;
  isVerified: boolean;
  createJWT: () => string;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a valid user name"],
    minlength: 3,
    maxlength: 30,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide a valid email"],
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: [...Object.values(UserRole), null],
    default: null,
  },
  roleData: {
    type: Object,
    default: {},
    validate: {
      validator: function (this: any, value: any) {
        if (!this.role) return true;
        return value && Object.keys(value).length > 0;
      },
      message: "roleData must be provided when role is set",
    },
  },
  avatar: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createJWT = function () {
  const payload: JwtPayload = { userId: this._id.toString() };
  const options: SignOptions = { expiresIn: "7d" };
  return jwt.sign(payload, config.jwt.secret, options);
};

const UserModel = mongoose.model<UserModelI>("User", userSchema);

export default UserModel;
