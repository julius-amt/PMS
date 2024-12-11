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
    const token = req.cookies.token;
    if (token) {
        jwt.verify(
            token,
            process.env.JWT_SECRET as string,
            (err: any, decoded: any) => {
                if (err) {
                    return res.status(403).redirect("/auth/login");
                }
                req.user = decoded;
                next();
            }
        );
    } else {
        res.status(401).redirect("/auth/login");
    }
};
