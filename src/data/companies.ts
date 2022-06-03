import { Company, CompanyInterest, ReservationDetail, ReservationForm } from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function getCompanies(): Promise<Company[]> {
	return createPromiseWithDBQuery<Company[]>(
		'SELECT * FROM companies',
		undefined,
		(resolve, result: Company[]) => resolve(result)
	);
}

export function getCompanyInterestsByUserId(
	userId: number
): Promise<CompanyInterest[]> {
	return createPromiseWithDBQuery<CompanyInterest[]>(
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
	return createPromiseWithDBQuery<number>(
		'INSERT INTO reservations SET ?',
		reservationWithFK,
		(resolve, result) => {
			resolve(result['insertId']);
		}
	);
}

export function getReservationDetail(userId: number): Promise<ReservationDetail> {
	return createPromiseWithDBQuery<ReservationDetail>(
		'SELECT * FROM reservations WHERE userId = ?',
		userId,
		(resolve, result) => resolve(result[0])
	)
}

export function findCompanyById(companyId: string): Promise<Company> {
	return createPromiseWithDBQuery<Company>(
		'SELECT * FROM companies WHERE id = ?',
		companyId,
		(resolve, result) => resolve(result[0])
	);
}

export function findCompanyInterestById(
	userId: number,
	companyId: string
): Promise<boolean> {
	return createPromiseWithDBQuery<boolean>(
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
	return createPromiseWithDBQuery<number>(
		'INSERT INTO companyinterests (userId, companyId) VALUES (?, ?)',
		[userId, companyId],
		(resolve, result) => resolve(result['insertId'])
	);
}

export function removeCompanyInterest(
	userId: number,
	companyId: string
): Promise<void> {
	return createPromiseWithDBQuery<void>(
		'DELETE FROM companyinterests WHERE userId = ? AND companyId = ?',
		[userId, companyId],
		(resolve, result) => resolve(result)
	);
}

export function getNumberOfReservationsOfUser(userId: number): Promise<number> {
	return createPromiseWithDBQuery(
		'SELECT COUNT(*) FROM reservations WHERE userId = ?',
		userId,
		(resolve, result) => resolve(result)
	);
}

export function getNumberOfInterestedCompaniesOfUser(
	userId: number
): Promise<number> {
	return createPromiseWithDBQuery(
		'SELECT COUNT(*) FROM companyinterests WHERE userId = ?',
		userId,
		(resolve, result) => resolve(result)
	);
}
