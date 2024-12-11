import { Response, Request } from "express";
import connect from "@/utils/dbConfig";
import { matchedData } from "express-validator";
import bcrypt from "bcrypt";
import User from "@/models/users";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "@/utils/mailer";
import { requestBodyErrorsInterrupt } from "@/utils/middleware/handleReqBodyErrors";

connect();

class AuthController {
    static async signup(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

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
        res.render("./auth/signup", { layout: false });
    }

    static async login(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { email, password } = matchedData(req);
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).render("./auth/login", {
                error: "Bad credentials!",
                layout: false,
            });
            return;
        }

        // verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).render("./auth/login", {
                error: "Bad credentials!",
                layout: false,
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

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            sameSite: true,
        });

        res.redirect("/products");
    }

    static async loginPage(req: Request, res: Response) {
        res.render("./auth/login", { layout: false });
    }

    // logout endpoint
    static async logout(req: Request, res: Response) {
        res.clearCookie("token");

        res.json({ success: true });
    }

    static async forgotPassword(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { email } = matchedData(req);
        const user = await User.findOne({
            email,
        });
        if (!user) {
            res.status(400).render("./auth/forgot-password", {
                error: "User not found!",
                layout: false,
            });
            return;
        }

        // create hash token & update user with token and token expiry
        const hashToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET as string,
            {
                expiresIn: "1h",
            }
        );

        await User.findByIdAndUpdate(
            { _id: user._id },
            {
                resetToken: hashToken,
                resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
            }
        );

        // send email to user
        const _result = await sendResetPasswordEmail(user, hashToken);
        if (_result.success) {
            res.redirect(
                "/auth/login?successMsg=Reset%20link%20sent%20to%20your%20email"
            );
            return;
        }

        res.status(500).render("./auth/forgot-password", {
            error: "Error sending email, please try again",
            layout: false,
        });
    }

    static async forgotPasswordPage(req: Request, res: Response) {
        res.render("./auth/forgot-password", { layout: false });
    }

    static async resetPassword(req: Request, res: Response) {
        const result = requestBodyErrorsInterrupt(req, res);
        if (result) return;

        const { password, confirmPassword } = matchedData(req);
        if (password !== confirmPassword) {
            res.status(400).render("./auth/reset-password", {
                error: "Password does not match",
                layout: false,
            });
            return;
        }

        // verify token from query
        const hashToken = req.query.token as string;
        const decoded = jwt.verify(hashToken, process.env.JWT_SECRET as string);
        if (!decoded) {
            res.status(400).render("./auth/reset-password", {
                error: "Invalid token",
                layout: false,
            });
        }

        // hash & update user password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await User.findOne({
            resetToken: hashToken,
            resetTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            res.status(400).render("./auth/reset-password", {
                error: "Invalid or expired token",
                layout: false,
            });
            return;
        }

        user.password = hashPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.redirect("/auth/login?successMsg=Password%20reset%20successful");
    }

    static async resetPasswordPage(req: Request, res: Response) {
        res.render("./auth/reset-password", { layout: false });
    }
}

export default AuthController;
