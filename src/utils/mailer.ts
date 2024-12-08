import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (user: any, hashToken: string) => {
    try {
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
                name: "MacStore Team",
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
