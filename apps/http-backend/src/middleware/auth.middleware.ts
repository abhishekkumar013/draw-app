import { JWT_SECRET } from "@repo/backend-common/config";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "../utils/aynchandler.js";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const isAuthenticated = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const token: string =
        (req.cookies?.token || req.headers["authorization"]?.split(" ")[1]) ??
        "";

      if (!token || token === "") {
        return res.status(401).json({
          success: false,
          message: "No token provided, authorization denied",
        });
      }

      const decoded = jwt.verify(
        token as string,
        JWT_SECRET as string
      ) as JwtPayload;

      if (!decoded?.id) {
        return res.status(403).json({
          success: false,
          message: "Invalid token, authorization denied",
        });
      }

      req.userId = decoded.id;
      next();
    } catch (error) {
      next(error);
    }
  }
);
