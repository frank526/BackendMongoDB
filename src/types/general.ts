import { Request, Response, NextFunction } from 'express';

declare global {
    type Middleware = (
        req: Request,
        res: Response
        ) => Promise<Response<any, Record<string, any>>>

    type MiddlewareNext = (
        req: Request,
        res: Response,
        next: NextFunction
        ) => Promise<void | Response<any, Record<string, any>>>
}
