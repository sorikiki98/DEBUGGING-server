import { pool } from '../db/database.js';
export function createUser(user) {
    const { userName, password, contactNumbers, email, address, sizeOfHouse, numOfRooms, } = user;
    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO users (user_name, password, contact_numbers, email, address, size_of_house, num_of_rooms) VALUES (?, ?, ?, ?, ?, ?, ?)', [
            userName,
            password,
            contactNumbers,
            email,
            address,
            sizeOfHouse,
            numOfRooms,
        ], (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result['insertId']);
        });
    });
}
export function findUserByName(userName) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM users WHERE user_name = ?', userName, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result[0]);
        });
    });
}
//# sourceMappingURL=user.js.map