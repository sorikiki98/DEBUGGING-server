import { NextFunction, Request, Response } from "express";

export function isAuth(req: Request, res: Response, next: NextFunction) {
    next();
}