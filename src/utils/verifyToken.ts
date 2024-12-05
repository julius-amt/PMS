import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
    interface Request {
        user?: JwtPayload;
    }
}

export const authenticatedUser = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        return null;
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as jwt.JwtPayload;

    req.user = decoded || null;
    next();
};
