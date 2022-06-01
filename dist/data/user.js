import { pool } from '../db/database.js';
// Todo: integrate with createPromiseWithUser function
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
export function findUserById(userId) {
    return createPromiseWithUser(userId, 'SELECT * FROM users WHERE id = ?');
}
export function findUserByName(userName) {
    return createPromiseWithUser(userName, 'SELECT * FROM users WHERE user_name = ?');
}
function createPromiseWithUser(param, query) {
    return new Promise((resolve, reject) => {
        pool.query(query, param, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result[0]);
        });
    });
}
//# sourceMappingURL=user.js.map