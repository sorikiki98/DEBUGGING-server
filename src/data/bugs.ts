import { MysqlError } from 'mysql';
import { pool } from '../db/database.js';
import { Bug, Survey } from '../types/index.js';

export function getBugs(): Promise<Bug[]> {
	return createPromiseWithBugApi('SELECT * FROM bugs');
}

export function getBug(bugId: string): Promise<Bug> {
	return createPromiseWithBugApi('SELECT * FROM bugs WHERE id = ?', bugId);
}

export function addSurveyResult(userId: number, bugId: string) {
	const survey = { userId, bugId, surveyDate: new Date() };
	return createPromiseWithBugApi('INSERT INTO surveys SET ?', survey);
}

function createPromiseWithBugApi<T = Bug | Bug[]>(
	query: string,
	param?: string | Survey
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
