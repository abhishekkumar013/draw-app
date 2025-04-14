import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/aynchandler.js";
import { CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import slugify from "slugify";

interface AuthenticatedRequest extends Request {
  userId?: string;
}
const generateSlug = (name: string) =>
  name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

export const createRoomController = asyncHandler(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const parseData = CreateRoomSchema.safeParse(req.body);

      if (!parseData.success) {
        return res.status(400).json({
          message: "Incorrect Input",
          success: false,
        });
      }

      const room = await prismaClient.room.create({
        data: {
          slug: generateSlug(parseData.data.name),
          adminId: req.userId!,
        },
      });

      return res.status(200).json({
        message: "room created successfully",
        success: true,
        room,
      });
    } catch (error) {
      next(error);
    }
  }
);

export const GetRoomDetailsFromSlug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const slug = req.params.slug;

      const room = await prismaClient.room.findFirst({
        where: {
          slug,
        },
      });
      if (!room) {
        return res.status(200).json({
          message: "room fetched successfully",
          success: false,
          room,
        });
      }

      return res.status(200).json({
        message: "room fetched successfully",
        success: true,
        room,
      });
    } catch (error) {
      next(error);
    }
  }
);
