import { MysqlError } from 'mysql';
import { pool } from '../db/database.js';
import { BugResult } from '../types/bugs.js';

export function getBugs(): Promise<BugResult[]> {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT * FROM bugs',
			(error: MysqlError, result: BugResult[]) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result);
			}
		);
	});
}

export function getBug(bugId: number): Promise<BugResult> {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT * FROM bugs WHERE id = ?',
			bugId,
			(error: MysqlError | null, result: BugResult[]) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result[0]);
			}
		);
	});
}
