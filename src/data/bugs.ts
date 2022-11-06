import { Bug, SurveyItem } from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function getBugs(): Promise<Bug[]> {
	return createPromiseWithDBQuery<Bug[]>(
		'SELECT * FROM bugs',
		undefined,
		(resolve, result) => resolve(result)
	);
}

export function getBug(bugId: string): Promise<Bug> {
	return createPromiseWithDBQuery<Bug>(
		'SELECT * FROM bugs WHERE id = ?',
		bugId,
		(resolve, result) => resolve(result[0])
	);
}

export function addSurveyResult(
	userId: number,
	bugId: string
): Promise<number> {
	const survey = { userId, bugId, surveyDate: new Date() };
	return createPromiseWithDBQuery<number>(
		'INSERT INTO surveys SET ?',
		survey,
		(resolve, result) => resolve(result['insertId'])
	);
}

export function getSurveyItemsOfUser(userId: number): Promise<SurveyItem[]> {
	return createPromiseWithDBQuery<SurveyItem[]>(
		'SELECT s.id AS surveyId, s.userId, s.surveyDate, s.bugId, b.name AS bugName FROM surveys AS s INNER JOIN bugs AS b ON s.bugId = b.id WHERE s.userId = ?',
		userId,
		(resolve, result) => resolve(result)
	);
}
