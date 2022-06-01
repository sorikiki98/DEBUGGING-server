import { Db } from 'mongodb';
import { pool } from '../db/database.js';
import { Company, ReservationForm } from '../types/index.js';

export function getCompanies(): Promise<Company[]> {
	return new Promise((resolve, reject) => {
		pool.query('SELECT * FROM companies', (error, result) => {
			if (error) {
				console.log(error.sqlMessage);
				reject(error);
			}
			resolve(result);
		});
	});
}

export function reserveCompany(
	userId: number,
	companyId: string,
	reservation: ReservationForm
): Promise<number> {
	return new Promise((resolve, reject) => {
		const reservationWithFK = { userId, companyId, ...reservation };
		pool.query(
			'INSERT INTO reservations SET ?',
			reservationWithFK,
			(error, result) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result['insertId']);
			}
		);
	});
}

export function findCompanyById(companyId: string): Promise<Company> {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT * FROM companies WHERE id = ?',
			companyId,
			(error, result) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result[0]);
			}
		);
	});
}
