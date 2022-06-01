import { pool } from '../db/database.js';
export function getCompanies() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM companies', (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result);
        });
    });
}
export function reserveCompany(userId, companyId, reservation) {
    return new Promise((resolve, reject) => {
        const reservationWithFK = Object.assign({ userId, companyId }, reservation);
        pool.query('INSERT INTO reservations SET ?', reservationWithFK, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result['insertId']);
        });
    });
}
export function findCompanyById(companyId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM companies WHERE id = ?', companyId, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result[0]);
        });
    });
}
//# sourceMappingURL=companies.js.map