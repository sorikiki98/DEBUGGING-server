import { pool } from '../db/database.js';
export function createUser(user) {
    return createPromiseWithUser('INSERT INTO users SET ?', user);
}
export function findUserById(userId) {
    return createPromiseWithUser('SELECT * FROM users WHERE id = ?', userId);
}
export function findUserByName(userName) {
    return createPromiseWithUser('SELECT * FROM users WHERE userName = ?', userName);
}
const isUserRegistration = function (param) {
    return param.userName !== undefined;
};
function createPromiseWithUser(query, param) {
    return new Promise((resolve, reject) => {
        pool.query(query, param, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            if (isUserRegistration(param)) {
                resolve(result['inserId']);
            }
            else {
                resolve(result[0]);
            }
        });
    });
}
//# sourceMappingURL=user.js.map