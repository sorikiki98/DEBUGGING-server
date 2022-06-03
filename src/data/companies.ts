import { pool } from '../db/database.js';
import {
	Company,
	CompanyInterest,
	ReservationForm,
	ReservationWithFK,
} from '../types/index.js';

export function getCompanies(): Promise<Company[]> {
	return createPromiseWithCompany<Company[]>(
		'SELECT * FROM companies',
		undefined,
		(resolve, result: Company[]) => resolve(result)
	);
}

export function getCompanyInterestsByUserId(
	userId: number
): Promise<CompanyInterest[]> {
	return createPromiseWithCompany<CompanyInterest[]>(
		'SELECT * FROM companyinterests WHERE userId = ?',
		userId,
		(resolve, result: CompanyInterest[]) => resolve(result)
	);
}

export function reserveCompany(
	userId: number,
	companyId: string,
	reservation: ReservationForm
): Promise<number> {
	const reservationWithFK = { userId, companyId, ...reservation };
	return createPromiseWithCompany<number>(
		'INSERT INTO reservations SET ?',
		reservationWithFK,
		(resolve, result) => {
			resolve(result['insertId']);
		}
	);
}

export function findCompanyById(companyId: string): Promise<Company> {
	return createPromiseWithCompany<Company>(
		'SELECT * FROM companies WHERE id = ?',
		companyId,
		(resolve, result) => resolve(result[0])
	);
}

export function findCompanyInterestById(
	userId: number,
	companyId: string
): Promise<boolean> {
	return createPromiseWithCompany<boolean>(
		'SELECT * FROM companyinterests WHERE userId = ? AND companyId = ?',
		[userId, companyId],
		(resolve, result) => {
			if (!result[0]) resolve(false);
			else resolve(true);
		}
	);
}

export function addCompanyInterest(
	userId: number,
	companyId: string
): Promise<number> {
	return createPromiseWithCompany<number>(
		'INSERT INTO companyinterests (userId, companyId) VALUES (?, ?)',
		[userId, companyId],
		(resolve, result) => resolve(result['insertId'])
	);
}

export function removeCompanyInterest(
	userId: number,
	companyId: string
): Promise<void> {
	return createPromiseWithCompany<void>(
		'DELETE FROM companyinterests WHERE userId = ? AND companyId = ?',
		[userId, companyId],
		(resolve, result) => resolve(result)
	);
}

type CompanyInterestFK = [number, string];
type DBQueryParamType =
	| number
	| string
	| undefined
	| ReservationWithFK
	| CompanyInterestFK;
type ResolveCallback<T> = (
	resolve: (value: T | PromiseLike<T>) => void,
	result: any
) => any;
type PromiseReturnType =
	| Company
	| Company[]
	| CompanyInterest[]
	| number
	| boolean
	| void;

function createPromiseWithCompany<T = PromiseReturnType>(
	query: string,
	params: DBQueryParamType,
	callback: ResolveCallback<T>
): Promise<T> {
	return new Promise((resolve, reject) => {
		pool.query(query, params, (error, result) => {
			if (error) {
				console.log(error.sqlMessage);
				reject(error);
			}
			callback(resolve, result);
		});
	});
}