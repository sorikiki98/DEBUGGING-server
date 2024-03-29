import {
	Company,
	ReservationDetail,
	ReservationForm,
	ReservationItem,
} from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function getCompanies(): Promise<Company[]> {
	return createPromiseWithDBQuery<Company[]>(
		'SELECT * FROM companies',
		undefined,
		(resolve, result: Company[]) => resolve(result)
	);
}

export function reserveCompany(
	userId: number,
	companyId: string,
	reservation: ReservationForm
): Promise<number> {
	const reservationWithFK = { userId, companyId, ...reservation };
	return createPromiseWithDBQuery<number>(
		'INSERT INTO reservations SET ?',
		reservationWithFK,
		(resolve, result) => {
			resolve(result['insertId']);
		}
	);
}

export function getReservationDetail(
	reservationId: string
): Promise<ReservationDetail> {
	return createPromiseWithDBQuery<ReservationDetail>(
		'SELECT * FROM reservations WHERE id = ?',
		reservationId,
		(resolve, result) => resolve(result[0])
	);
}

export function findCompanyById(companyId: string): Promise<Company> {
	return createPromiseWithDBQuery<Company>(
		'SELECT * FROM companies WHERE id = ?',
		companyId,
		(resolve, result) => resolve(result[0])
	);
}

export const isCompanyInterested = async (
	userId: number,
	companyId: string
): Promise<number> => {
	return createPromiseWithDBQuery<number>(
		'SELECT * FROM companyinterests WHERE userId = ? AND companyId = ?',
		[userId, companyId],
		(resolve, result) => {
			if (!result[0]) resolve(0);
			else resolve(1);
		}
	);
};

export function addCompanyInterest(
	userId: number,
	companyId: string
): Promise<number> {
	return createPromiseWithDBQuery<number>(
		'INSERT INTO companyinterests (userId, companyId) VALUES (?, ?)',
		[userId, companyId],
		(resolve, result) => resolve(result['insertId'])
	);
}

export function removeCompanyInterest(
	userId: number,
	companyId: string
): Promise<undefined> {
	return createPromiseWithDBQuery<undefined>(
		'DELETE FROM companyinterests WHERE userId = ? AND companyId = ?',
		[userId, companyId],
		(resolve, result) => resolve(result)
	);
}

export function getNumberOfReservationsOfUser(userId: number): Promise<number> {
	return createPromiseWithDBQuery<number>(
		'SELECT COUNT(*) FROM reservations WHERE userId = ?',
		userId,
		(resolve, result) => resolve(result[0]['COUNT(*)'])
	);
}

export function getNumberOfInterestedCompaniesOfUser(
	userId: number
): Promise<number> {
	return createPromiseWithDBQuery<number>(
		'SELECT COUNT(*) FROM companyinterests WHERE userId = ?',
		userId,
		(resolve, result) => resolve(result[0]['COUNT(*)'])
	);
}

export const getNumberOfInterestedUsersOfCompany = async (
	companyId: string
): Promise<number> => {
	return createPromiseWithDBQuery<number>(
		'SELECT COUNT(*) FROM companyinterests WHERE companyId = ?',
		companyId,
		(resolve, result) => resolve(result[0]['COUNT(*)'])
	);
};

export function getReservationItemsOfUser(
	userId: number
): Promise<ReservationItem[]> {
	return createPromiseWithDBQuery<ReservationItem[]>(
		'SELECT r.id AS reservationId, r.userId, r.processState, r.bugName, c.name AS companyName, r.reservationDateTime, r.visitDateTime FROM reservations AS r INNER JOIN companies AS c ON r.companyId = c.id WHERE r.userId = ?',
		userId,
		(resolve, result) => resolve(result)
	);
}
