import express, { Router } from "express";
import {
  GetAllUsersControlller,
  SignInConroller,
  SignUpController,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router: Router = express.Router();

router.route("/signup").post(SignUpController);
router.route("/signin").post(SignInConroller);

// router.use(isAuthenticated);
router.route("/all").get(GetAllUsersControlller);

export default router;
