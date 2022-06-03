import { pool } from '../db/database.js';
export default function createPromiseWithDBQuery(query, params, callback) {
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
//# sourceMappingURL=promise.js.map