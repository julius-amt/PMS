import User from "@/models/users";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (user: any) => {
    try {
        // create hash token & update user
        const hashToken = await bcrypt.hash(user._id.toString(), 10);

        await User.findByIdAndUpdate(
            { _id: user._id },
            {
                resetToken: hashToken,
                resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
            }
        );

        // create email transport
        const transporter = nodemailer.createTransport({
            service: "gmail",
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT!),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // send email
        await transporter.sendMail({
            from: {
                name: "MacShop Team",
                address: process.env.EMAIL_USER!,
            },
            to: user.email,
            subject: "Password Reset",
            html: `
				<p>Dear ${user.username || "User"},</p>
				<p>We received a request to reset your password. To reset your password, please click the link below. Note that this reset link will expire in one hour.</p>
				<p><a href="${
                    process.env.BASE_URL
                }/auth/reset-password?token=${hashToken}">Reset Password</a></p>
				<p>If you did not request this reset, please disregard this email.</p>
				<p>Thank you</p>
			`,
        });

        return { success: true };
    } catch (error: any) {
        throw new Error(error.message);
    }
};
