import { Response, Request } from "express";
import { validationResult } from "express-validator";

export const requestBodyErrorsInterrupt = (req: Request, res: Response) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        const extractedErrors: any[] = [];
        errors.array().map((err: { path?: string; msg: string }) => {
            if (err.path) {
                extractedErrors.push({ [err.path]: err.msg });
            }
        });

        res.status(400).render(`.${req.originalUrl}`);
        return true;
    }
    return false;
};
