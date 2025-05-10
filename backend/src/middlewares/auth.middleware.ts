import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import UserModel, { UserModelI } from "../models/user/user.model";
import HttpExceptions from "../utility/exceptions/HttpExceptions";
import { JwtPayload, UserRole } from "../types";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      throw HttpExceptions.Unauthorized("Authentication required");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Find user
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw HttpExceptions.Unauthorized("User not found");
    }

    // Check if user is verified
    if (!user.isVerified) {
      throw HttpExceptions.Unauthorized("Please verify your email first");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(HttpExceptions.Unauthorized("Invalid token"));
    } else {
      next(error);
    }
  }
};

export const authMiddlewareForVerification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
      throw HttpExceptions.Unauthorized("Authentication required");
    }

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;

    // Find user
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw HttpExceptions.Unauthorized("User not found");
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(HttpExceptions.Unauthorized("Invalid token"));
    } else {
      next(error);
    }
  }
};

export const roleMiddleware = (allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user as UserModelI;

      if (!user) {
        throw HttpExceptions.Unauthorized("Authentication required");
      }

      if (!user.role || !allowedRoles.includes(user.role)) {
        throw HttpExceptions.Forbidden(
          `Access denied. Required role: ${allowedRoles.join(" or ")}`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
