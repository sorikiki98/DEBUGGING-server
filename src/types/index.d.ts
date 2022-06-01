import { JsonWebTokenError, Jwt } from 'jsonwebtoken';

declare global {
	namespace Express {
		interface Request {
			userId?: number;
		}
	}
}

export type Bug = {
	id: number;
	name: string;
	appearance: string;
	movement: string;
	habitat: string;
	color: string;
	surveyResult: string;
};

export type Survey = {
	userId: number;
	bugId: string;
	surveyDate: Date;
};

export type Company = {
	id: number;
	name: string;
	shortIntro: string;
	description: string;
	contactNumbers: string;
	killableBugs: string;
	availableArea: string;
	availableCounselTime: string;
	thumbnail?: string;
	isCompanyInterested?: boolean = false;
};

export type UserRegistration = {
	userName: string;
	password: string;
	name: string;
	contactNumbers: string;
	email: string;
	address?: string;
	sizeOfHouse?: number;
	numOfRooms?: number;
};

export type User = { id: number } & UserRegistration;

export type UserLogin = {
	userName: string;
	password: string;
};

export type UserAuthenticationSuccess = {
	token: string;
	userName: string;
};

export type JwtPayloadWithUserId = Jwt.JwtPayload & { userId: number };
