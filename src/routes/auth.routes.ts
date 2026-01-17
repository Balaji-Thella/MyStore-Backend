import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { authSeller } from "../middleware/auth";

const authRouter = Router();

authRouter.post("/sendOtp", AuthController.sendOtp);
authRouter.post("/verifyOtp", AuthController.verifyOtp);

authRouter.get("/me", authSeller, AuthController.getMe);
authRouter.post("/logout", authSeller, AuthController.logout);

export default authRouter;
