import { UserRegistration, User } from '../types/index.js';
import createPromiseWithDBQuery from '../util/promise.js';

export function createUser(user: UserRegistration): Promise<number> {
	return createPromiseWithDBQuery<number>(
		'INSERT INTO users SET ?',
		user,
		(resolve, result) => resolve(result['insertId'])
	);
}

export function findUserById(userId: number): Promise<User> {
	return createPromiseWithDBQuery<User>(
		'SELECT * FROM users WHERE id = ?',
		userId,
		(resolve, result) => resolve(result[0])
	);
}

export function findUserByName(userName: string): Promise<User> {
	return createPromiseWithDBQuery<User>(
		'SELECT * FROM users WHERE userName = ?',
		userName,
		(resolve, result) => resolve(result[0])
	);
}

export function deleteUser(userId: number): Promise<undefined> {
	return createPromiseWithDBQuery<undefined>(
		'DELETE FROM users WHERE id = ?',
		userId,
		(resolve, result) => resolve(result)
	);
}

//export function getUserDetail(userId: number): Promise<UserDetail> {
//	return createPromiseWithDBQuery(
//
//)
//}
