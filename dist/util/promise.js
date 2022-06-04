import { pool } from '../db/database.js';
export default function createPromiseWithDBQuery(query, params, callback) {
    return new Promise((resolve, reject) => {
        pool.query(query, params, (error, result) => {
            if (error)
                reject(error);
            else
                callback(resolve, result);
        });
    });
}
//# sourceMappingURL=promise.js.map