import { NextFunction, Request, Response } from 'express';

export default function() {
    const headerKey = 'Bearer';

    return (req: Request, res: Response, next: NextFunction) => {
        let token;

        if (req.headers && req.headers.authorization) {

            const authorization: any = req.headers.authorization;

            const parts: any = authorization.split(' ');
            if (parts.length === 2 && parts[0] === headerKey) {
                token = parts[1];
            }
        }

        res.locals.token = token;
        next();
    };
}
