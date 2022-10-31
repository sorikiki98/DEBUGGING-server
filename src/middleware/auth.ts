import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtPayloadWithUserId } from '../types/index';
import * as UserRepository from '../data/user';

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.get('Authorization');

	let token;

	if (authHeader && authHeader.split(' ')[0].startsWith('Bearer')) {
		token = authHeader.split(' ')[1];
	}

	if (!token) {
		return res.status(401).json({ message: 'Authorization header is invalid.' });
	}

	jwt.verify(
		token,
		config.jwt.privateKey,
		async (err: jwt.VerifyErrors | null, decoded: JwtPayloadWithUserId) => {
			if (err) {
				return res.status(401).json({ message: err.message });
			}
			
			const user = await UserRepository.findUserById(decoded.userId);
			if (!user) {
				return res.status(401).json({ message: 'User does not exist.'});
			}

			req.userId = decoded.userId;
			next();
		}
	);
};
