import createPromiseWithDBQuery from '../util/promise.js';
export function getBugs() {
    return createPromiseWithDBQuery('SELECT * FROM bugs', undefined, (resolve, result) => resolve(result));
}
export function getBug(bugId) {
    return createPromiseWithDBQuery('SELECT * FROM bugs WHERE id = ?', bugId, (resolve, result) => resolve(result[0]));
}
export function addSurveyResult(userId, bugId) {
    const survey = { userId, bugId, surveyDate: new Date() };
    return createPromiseWithDBQuery('INSERT INTO surveys SET ?', survey, (resolve, result) => resolve(result['insertId']));
}
export function getSurveyItemsOfUser(userId) {
    return createPromiseWithDBQuery('SELECT s.surveyDate, s.bugId, b.name FROM surveys AS s INNER JOIN bugs AS b ON s.bugId = b.id WHERE s.userId = ?', userId, (resolve, result) => resolve(result));
}
//# sourceMappingURL=bugs.js.map