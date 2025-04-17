import { JWT_SECRET } from "@repo/backend-common/config";
import { WebSocketServer, WebSocket } from "ws";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8081 });

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  try {
    const decode = jwt.verify(token, JWT_SECRET as string) as JwtPayload;

    if (typeof decode == "string") {
      return null;
    }
    if (!decode || !decode.id) {
      return null;
    }
    return decode.id;
  } catch (error) {
    return null;
  }
}

wss.on("connection", function connection(ws, request) {
  const url = request.url;

  if (!url) {
    return;
  }
  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token") || "";

  const userId = checkUser(token);
  if (!userId) {
    ws.close();
    return;
  }
  users.push({
    ws,
    rooms: [],
    userId,
  });

  ws.on("message", async function message(data) {
    const parseData = JSON.parse(data as unknown as string);

    if (parseData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parseData.roomId);
    }
    if (parseData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);

      if (!user || !user.rooms) return;

      user.rooms = user.rooms.filter((room) => room !== parseData.roomId);
    }

    if (parseData.type === "chat") {
      // console.log(users);
      const roomId = parseData.roomId;
      const message = parseData.message;

      await prismaClient.chat.create({
        data: {
          roomId: Number(roomId),
          message,
          userId,
        },
      });

      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: message,
              roomId,
            })
          );
        }
      });
    }
  });
});
