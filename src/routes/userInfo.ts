import { Router } from "express";
import UserInfoController from "@/controllers/userInfo";

const router = Router();
router.get("/me", UserInfoController.currentUserInfo);

export { router as userInfoRouter };
