import { pool } from '../db/database.js';
export function getCompanies() {
    return createPromiseWithCompany('SELECT * FROM companies', undefined, (resolve, result) => resolve(result));
}
export function getCompanyInterestsByUserId(userId) {
    return createPromiseWithCompany('SELECT * FROM companyinterests WHERE userId = ?', userId, (resolve, result) => resolve(result));
}
export function reserveCompany(userId, companyId, reservation) {
    const reservationWithFK = Object.assign({ userId, companyId }, reservation);
    return createPromiseWithCompany('INSERT INTO reservations SET ?', reservationWithFK, (resolve, result) => {
        resolve(result['insertId']);
    });
}
export function findCompanyById(companyId) {
    return createPromiseWithCompany('SELECT * FROM companies WHERE id = ?', companyId, (resolve, result) => resolve(result[0]));
}
export function findCompanyInterestById(userId, companyId) {
    return createPromiseWithCompany('SELECT * FROM companyinterests WHERE userId = ? AND companyId = ?', [userId, companyId], (resolve, result) => {
        if (!result[0])
            resolve(false);
        else
            resolve(true);
    });
}
export function addCompanyInterest(userId, companyId) {
    return createPromiseWithCompany('INSERT INTO companyinterests (userId, companyId) VALUES (?, ?)', [userId, companyId], (resolve, result) => resolve(result['insertId']));
}
export function removeCompanyInterest(userId, companyId) {
    return createPromiseWithCompany('DELETE FROM companyinterests WHERE userId = ? AND companyId = ?', [userId, companyId], (resolve, result) => resolve(result));
}
function createPromiseWithCompany(query, params, callback) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            callback(resolve, result);
        });
    });
}
//# sourceMappingURL=companies.js.map