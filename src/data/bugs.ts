import { MysqlError } from 'mysql';
import { pool } from '../db/database.js';
import { Bug } from '../types/index.js';

// Todo: integrate with createPromiseWithBug
export function getBugs(): Promise<Bug[]> {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT * FROM bugs',
			(error: MysqlError, result: Bug[]) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result);
			}
		);
	});
}

export function getBug(bugId: string): Promise<Bug> {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT * FROM bugs WHERE id = ?',
			bugId,
			(error: MysqlError | null, result: Bug[]) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result[0]);
			}
		);
	});
}
