import { NextFunction, Request, Response } from "express";

export const handleUnprotectedRoutesFromAuthUsers = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.cookies.token) {
        const originalURL = req.originalUrl;
        res.redirect(originalURL);
        return;
    }
    next();
};
