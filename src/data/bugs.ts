import { Bug } from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function getBugs(): Promise<Bug[]> {
	return createPromiseWithDBQuery(
		'SELECT * FROM bugs',
		undefined,
		(resolve, result) => resolve(result)
	);
}

export function getBug(bugId: string): Promise<Bug> {
	return createPromiseWithDBQuery(
		'SELECT * FROM bugs WHERE id = ?',
		bugId,
		(resolve, result) => resolve(result[0])
	);
}

export function addSurveyResult(userId: number, bugId: string) {
	const survey = { userId, bugId, surveyDate: new Date() };
	return createPromiseWithDBQuery(
		'INSERT INTO surveys SET ?',
		survey,
		(resolve, result) => resolve(result['insertId'])
	);
}