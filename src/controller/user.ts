import { NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../data/user.js';
import {
	RequestWithUserRegistration,
	RequestWithUserLogin,
	ResponseWithUserAuthentication,
} from '../types/user.js';

const saltRounds = 10;
const jwtPrivateKey = 'VljbgaD4Nn$GGMJ4';
const jwtExpiration = 60000;

export async function createUser(
	req: RequestWithUserRegistration,
	res: ResponseWithUserAuthentication,
	next: NextFunction
) {
	const { userName, password } = req.body;
	const user = await UserRepository.findUserByName(userName);
	if (user) {
		return res.sendStatus(209);
	}

	const hashed = await bcrypt.hash(password, saltRounds);
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

export async function login(
	req: RequestWithUserLogin,
	res: ResponseWithUserAuthentication,
	next: NextFunction
) {
	const { userName, password } = req.body;
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
	return jwt.sign({ userId }, jwtPrivateKey, { expiresIn: jwtExpiration });
}
