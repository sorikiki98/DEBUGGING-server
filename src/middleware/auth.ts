import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { JwtPayloadWithUserId } from '../types/index.js';
import * as UserRepository from '../data/user.js';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.get('Authorization');

	let token;

	if (authHeader && authHeader.split(' ')[1]) {
		token = authHeader.split(' ')[1];
	}

	if (!token) {
		return res.sendStatus(401);
	}

	jwt.verify(
		token,
		config.jwt.privateKey,
		async (err: jwt.VerifyErrors | null, decoded: JwtPayloadWithUserId) => {
			if (err) {
				console.log(err.message);
				return res.sendStatus(401);
			}

			const user = await UserRepository.findUserById(decoded.userId);
			if (!user) {
				return res.sendStatus(401);
			}

			req.userId = decoded.userId;
			next();
		}
	);
};
