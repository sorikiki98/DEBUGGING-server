import { MysqlError } from 'mysql';
import { pool } from '../db/database.js';
import { Bug } from '../types/index.js';

export function getBugs(): Promise<Bug[]> {
	return createPromiseWithBugApi('SELECT * FROM bugs');
}

export function getBug(bugId: string): Promise<Bug> {
	return createPromiseWithBugApi('SELECT * FROM bugs WHERE id = ?', bugId);
}

function createPromiseWithBugApi<T = Bug | Bug[]>(
	query: string,
	param?: string
): Promise<T> {
	return new Promise((resolve, reject) => {
		pool.query(query, param, (error: MysqlError | null, result) => {
			if (error) {
				console.log(error.sqlMessage);
				reject(error);
			}
			if (typeof param == 'string') {
				resolve(result[0]);
			} else {
				resolve(result);
			}
		});
	});
}
