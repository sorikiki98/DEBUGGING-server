import createPromiseWithDBQuery from '../util/promise.js';
export function createUser(user) {
    return createPromiseWithDBQuery('INSERT INTO users SET ?', user, (resolve, result) => resolve(result['insertId']));
}
export function findUserById(userId) {
    return createPromiseWithDBQuery('SELECT * FROM users WHERE id = ?', userId, (resolve, result) => resolve(result[0]));
}
export function findUserByName(userName) {
    return createPromiseWithDBQuery('SELECT * FROM users WHERE userName = ?', userName, (resolve, result) => resolve(result[0]));
}
export function deleteUser(userId) {
    return createPromiseWithDBQuery('DELETE FROM users WHERE id = ?', userId, (resolve, result) => resolve(result));
}
//export function getUserDetail(userId: number): Promise<UserDetail> {
//	return createPromiseWithDBQuery(
//
//)
//}
//# sourceMappingURL=user.js.map