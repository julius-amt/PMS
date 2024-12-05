import { Router } from "express";
import { uploadImage } from "@/utils/middleware/multer";
import AuthController from "@/controllers/auth";
import { checkSchema } from "express-validator";
import {
    signupValidationSchema,
    loginValidationSchema,
    forgotPasswordValidationSchema,
    resetPasswordValidationSchema,
} from "@/utils/middleware/validator";

const router = Router();

router.post("/login", checkSchema(loginValidationSchema), AuthController.login);
router.post(
    "/signup",
    uploadImage.single("avatar"),
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
