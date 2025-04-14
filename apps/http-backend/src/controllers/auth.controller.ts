import { CookieOptions, NextFunction, Request, Response } from "express";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import asyncHandler from "../utils/aynchandler.js";

export const SignUpController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = CreateUserSchema.safeParse(req.body);

      if (!data.success) {
        return res.status(400).json({
          message: "Invalid input data",
          success: false,
          errors: data.error.errors,
        });
      }

      const { email, password, name, photo } = data.data;

      const existingUser = await prismaClient.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "User already exists! Please sign in.",
          success: false,
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newuser = await prismaClient.user.create({
        data: { email, password: hashedPassword, name, photo },
      });

      return res.status(201).json({
        message: "User created successfully",
        success: true,
        user: {
          id: newuser.id,
          email: newuser.email,
          name: newuser.name,
          photo: newuser.photo,
        },
      });
    } catch (error: any) {
      next(error);
      // return res.status(500).json({
      //   message: error.message || "Internal Server Error",
      //   success: false,
      // });
    }
  }
);
export const SignInConroller = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = SigninSchema.safeParse(req.body);

      if (!data.success) {
        return res.status(400).json({
          message: "Invalid input data",
          success: false,
          errors: data.error.errors,
        });
      }

      const { email, password } = data.data;

      const isUser = await prismaClient.user.findUnique({
        where: { email },
      });
      if (!isUser) {
        return res.status(404).json({
          message: "User not found!",
          sucess: false,
        });
      }
      const ispasswordMatch = await bcrypt.compare(password, isUser.password);

      if (!ispasswordMatch) {
        return res.status(404).json({
          message: "invalid credentials",
          success: false,
        });
      }
      // console.log(JWT_SECRET);
      const token = jwt.sign({ id: isUser.id }, JWT_SECRET as string, {
        expiresIn: "7d",
      });

      const options: CookieOptions = {
        httpOnly: true,
        secure: false,
        sameSite: "lax" as "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      };

      return res
        .cookie("token", token, options)
        .status(200)
        .json({
          message: "signin successfully",
          success: true,
          token,
          user: {
            id: isUser.id,
            email: isUser.email,
            name: isUser.name,
          },
        });
    } catch (error: any) {
      next(error);
    }
  }
);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const GetAllUsersControlller = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const users = await prismaClient.user.findMany({
        where: { id: { not: req.userId } },
      });

      res.status(200).json({
        message: "All users fetched",
        success: true,
        users,
      });
    } catch (error: any) {
      next(error);
    }
  }
);
