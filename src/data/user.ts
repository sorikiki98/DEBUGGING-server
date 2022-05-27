import { UserRegistration } from '../types/user.js';
import { pool } from '../db/database.js';
import { User } from '../types/user.js';

export function createUser(user: UserRegistration): Promise<number> {
	const {
		userName,
		password,
		contactNumbers,
		email,
		address,
		sizeOfHouse,
		numOfRooms,
	} = user;

	return new Promise((resolve, reject) => {
		pool.query(
			'INSERT INTO users (user_name, password, contact_numbers, email, address, size_of_house, num_of_rooms) VALUES (?, ?, ?, ?, ?, ?, ?)',
			[
				userName,
				password,
				contactNumbers,
				email,
				address,
				sizeOfHouse,
				numOfRooms,
			],
			(error, result) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result['insertId']);
			}
		);
	});
}

export function findUserByName(userName: string): Promise<User> {
	return new Promise((resolve, reject) => {
		pool.query(
			'SELECT * FROM users WHERE user_name = ?',
			userName,
			(error, result: User[]) => {
				if (error) {
					console.log(error.sqlMessage);
					reject(error);
				}
				resolve(result[0]);
			}
		);
	});
}
