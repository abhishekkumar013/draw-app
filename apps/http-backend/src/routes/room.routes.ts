import express, { Router } from "express";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createRoomController,
  GetRoomDetailsFromSlug,
} from "../controllers/room.controlller.js";

const router: Router = express.Router();

// router.use(isAuthenticated);
router.route("/create").post(createRoomController);
router.route("/:slug").get(GetRoomDetailsFromSlug);

export default router;
