import { NextFunction, Request, Response } from "express";
import asyncHandler from "../utils/aynchandler.js";
import { prismaClient } from "@repo/db/client";

// interface AuthenticatedRequest extends Request {
//   userId?: string;
// }

export const getRoomChatConroller = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const roomId = Number(req.params.roomId);

      const chats = await prismaClient.chat.findMany({
        where: {
          roomId: roomId,
        },
        orderBy: {
          id: "desc",
        },
        take: 500,
      });
      return res.status(200).json({
        message: "room chat fetched successfully",
        success: true,
        chats,
      });
    } catch (error) {
      next(error);
    }
  }
);
