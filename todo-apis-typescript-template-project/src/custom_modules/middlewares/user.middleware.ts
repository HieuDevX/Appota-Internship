import { NextFunction, Request, Response } from 'express';
import Exception from '../exceptions/Exception';
import ExceptionCode from '../exceptions/ExceptionCode';

export const auth = async (req: Request, res: Response, next: NextFunction) => {

    if (!res.locals.token) {
        return next(new Exception('missing token', ExceptionCode.REQUEST_PERMISSION_DENIED));
    }

    try {

        // validate token

    } catch (e) {
        return next(e);
    }

    next();
};
