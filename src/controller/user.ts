import { Request, Response, NextFunction } from 'express';
import * as UserRepository from '../data/user.js';
import { RequestWithUserRegistration, ResponseWithUserAuthentication } from '../types/user.js';

// Todo: password 암호화해서 보관 => 토큰 생성
export async function createUser(req: RequestWithUserRegistration, res: ResponseWithUserAuthentication, next: NextFunction) {
    const user = await UserRepository.findUserByName(req.body.userName);
    if (user) {
        return res.sendStatus(209);
    }

    const userId = await UserRepository.createUser(req.body);
    res.status(201).json({
        token: userId,
        userName: req.body.userName
    })
}

export async function login(req: Request, res: Response, next: NextFunction) {

}   
