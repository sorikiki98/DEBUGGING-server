import { pool } from '../db/database.js';
import { UserRegistration, User } from '../types/index.js';

export function createUser(user: UserRegistration): Promise<number> {
	return createPromiseWithUserApi('INSERT INTO users SET ?', user);
}

export function findUserById(userId: number): Promise<User> {
	return createPromiseWithUserApi('SELECT * FROM users WHERE id = ?', userId);
}

export function findUserByName(userName: string): Promise<User> {
	return createPromiseWithUserApi('SELECT * FROM users WHERE userName = ?', userName);
}

type DBQueryParamType = number | string | UserRegistration;

const isUserRegistration = function(param: DBQueryParamType): param is UserRegistration {
	return (param as UserRegistration).userName !== undefined;
}

function createPromiseWithUserApi<T = User | number>(query: string, param: DBQueryParamType): Promise<T> {
	return new Promise((resolve, reject) => {
		pool.query(query, param, (error, result) => {
			if (error) {
				console.log(error.sqlMessage);
				reject(error);
			}
			
			if (isUserRegistration(param)) {
				resolve(result['inserId']);
			} else {
				resolve(result[0]);
			}
			
		});
	});
}
