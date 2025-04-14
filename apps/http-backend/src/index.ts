import express, { Request, Response } from "express";
import { SigninSchema } from "@repo/common/types";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use(cookieParser());

import AuthRoutes from "./routes/auth.routes.js";
import RoomRoutes from "./routes/room.routes.js";
import ChatRoutes from "./routes/chats.routes.js";
import { errorHandler } from "./middleware/errorhandler.middleware.js";

app.use("/api/v1/user", AuthRoutes);
app.use("/api/v1/room", RoomRoutes);
app.use("/api/v1/chats", ChatRoutes);

app.listen(5050, () => {
  console.log("server start at port 5050");
});

app.use(errorHandler);
