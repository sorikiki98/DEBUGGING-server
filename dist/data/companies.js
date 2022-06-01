import { pool } from "../db/database.js";
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
//# sourceMappingURL=companies.js.map