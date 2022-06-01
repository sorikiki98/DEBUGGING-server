import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../data/user.js';
import { config } from '../config.js';
import { UserRegistration, UserLogin } from '../types/index.js';

export async function createUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { userName, password } = req.body as UserRegistration;
	const user = await UserRepository.findUserByName(userName);
	if (user) {
		return res.sendStatus(209);
	}

	const hashed = await bcrypt.hash(password, parseInt(config.bcrypt.saltsRound));
	const userId = await UserRepository.createUser({
		...req.body,
		password: hashed,
	});

	const token = createJWT(userId);

	res.status(201).json({
		token,
		userName,
	});
}

export async function login(req: Request, res: Response, next: NextFunction) {
	const { userName, password } = req.body as UserLogin;
	const user = await UserRepository.findUserByName(userName);
	if (!user) return res.sendStatus(401);

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.sendStatus(401);

	const token = createJWT(user.id);

	res.status(200).json({
		token,
		userName,
	});
}

function createJWT(userId: number): string {
	return jwt.sign({ userId }, config.jwt.privateKey, {
		expiresIn: config.jwt.expirSecs,
	});
}
