import { Response, Request } from "express";
import connect from "@/utils/dbConfig";
import { matchedData, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "@/models/users";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "@/utils/mailer";

connect();

class AuthController {
    static async signup(req: Request, res: Response) {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            const extractedErrors: any[] = [];
            errors.array().map((err: { path?: string; msg: string }) => {
                if (err.path) {
                    extractedErrors.push({ [err.path]: err.msg });
                }
            });

            console.log(extractedErrors);
            res.status(400).render("./auth/signup", {
                errors: extractedErrors,
            });
            return;
        }
        const data = matchedData(req);
        const { username, email, password, confirmPassword } = data;
        if (password !== confirmPassword) {
            res.status(400).redirect(
                "/auth/signup?errorMsg=Password%20does%20not%20match"
            );
            return;
        }

        // check if email already exist
        const userExist = await User.findOne({ email });
        if (userExist) {
            res.status(400).redirect(
                "/auth/signup?errorMsg=User%20already%20exist"
            );
            return;
        }

        // save user to database
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // if user provided, avatar
        const avatar = req.file;

        const newUser = new User({
            username,
            email,
            password: hashPassword,
            avatar: avatar
                ? avatar.filename
                : "bc666226-d3cf-43ef-91dd-47c2b21d3eec.jpg",
        });
        await newUser.save();
        res.status(201).redirect(
            "/auth/login?successMsg=Account%20created%20successfully🥳"
        );
    }

    static async signupPage(req: Request, res: Response) {
        res.render("./auth/signup");
    }

    static async login(req: Request, res: Response) {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            const extractedErrors: any[] = [];
            errors.array().map((err: { path?: string; msg: string }) => {
                if (err.path) {
                    extractedErrors.push({ [err.path]: err.msg });
                }
            });

            console.log(extractedErrors);
            res.status(400).render("./auth/login", {
                errors: extractedErrors,
            });
            return;
        }

        const { email, password } = matchedData(req);
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).render("./auth/login", {
                error: "Bad credentials!",
            });
            return;
        }

        // verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).render("./auth/login", {
                error: "Bad credentials!",
            });
            return;
        }

        // generate token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h",
            }
        );

        // set token inside the authorization headers
        res.setHeader("Authorization", `Bearer ${token}`);
        res.redirect("/products");
    }

    static async loginPage(req: Request, res: Response) {
        res.render("./auth/login");
    }

    static async forgotPassword(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors: any[] = [];
            errors.array().map((err: { path?: string; msg: string }) => {
                if (err.path) {
                    extractedErrors.push({ [err.path]: err.msg });
                }
            });

            res.status(400).render("./auth/forgot-password", {
                errors: extractedErrors,
            });
            return;
        }
        const { email } = matchedData(req);
        const user = await User.findOne({
            email,
        });
        if (!user) {
            res.status(400).render("./auth/forgot-password", {
                error: "User not found!",
            });
            return;
        }

        // send email to user
        const result = await sendResetPasswordEmail(user);
        if (result.success) {
            res.redirect(
                "/auth/login?successMsg=Reset%20link%20sent%20to%20your%20email"
            );
            return;
        }

        res.status(500).render("./auth/forgot-password", {
            error: "Error sending email, please try again",
        });
    }

    static async forgotPasswordPage(req: Request, res: Response) {
        res.render("./auth/forgot-password");
    }

    static async resetPassword(req: Request, res: Response) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors: any[] = [];
            errors.array().map((err: { path?: string; msg: string }) => {
                if (err.path) {
                    extractedErrors.push({ [err.path]: err.msg });
                }
            });

            res.status(400).render("./auth/reset-password", {
                errors: extractedErrors,
            });
            return;
        }

        const { password, confirmPassword } = matchedData(req);
        if (password !== confirmPassword) {
            res.status(400).render("./auth/reset-password", {
                error: "Password does not match",
            });
            return;
        }

        // update user password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.findOneAndUpdate(
            { email: req.body.email },
            { password: hashPassword }
        );

        if (!user) {
            res.status(400).render("./auth/reset-password", {
                error: "User not found",
            });
            return;
        }

        res.redirect("/auth/login?successMsg=Password%20reset%20successful");
    }

    static async resetPasswordPage(req: Request, res: Response) {
        res.render("./auth/reset-password");
    }
}

export default AuthController;
