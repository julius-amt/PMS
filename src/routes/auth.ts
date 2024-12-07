import { Router } from "express";
import { uploadAvatar } from "@/utils/middleware/multer";
import AuthController from "@/controllers/auth";
import { checkSchema } from "express-validator";
import {
    signupValidationSchema,
    loginValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
} from "@/utils/middleware/validators/auth";

const router = Router();

router.post("/login", checkSchema(loginValidationSchema), AuthController.login);
router.post(
    "/signup",
    uploadAvatar.single("avatar"),
    checkSchema(signupValidationSchema),
    AuthController.signup
);
router.post(
    "/forgot-password",
    checkSchema(forgotPasswordValidationSchema),
    AuthController.forgotPassword
);
router.post(
    "/reset-password",
    checkSchema(resetPasswordValidationSchema),
    AuthController.resetPassword
);

router.get("/login", AuthController.loginPage);
router.get("/signup", AuthController.signupPage);
router.get("/forgot-password", AuthController.forgotPasswordPage);
router.get("/reset-password", AuthController.resetPasswordPage);

export { router as authRouter };
