import express, { Router } from "express";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getRoomChatConroller } from "../controllers/chats.controller.js";

const router: Router = express.Router();

// router.use(isAuthenticated);
router.route("/:roomId").get(getRoomChatConroller);

export default router;
