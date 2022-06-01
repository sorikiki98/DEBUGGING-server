import { pool } from '../db/database.js';
export function getBugs() {
    return createPromiseWithBugApi('SELECT * FROM bugs');
}
export function getBug(bugId) {
    return createPromiseWithBugApi('SELECT * FROM bugs WHERE id = ?', bugId);
}
function createPromiseWithBugApi(query, param) {
    return new Promise((resolve, reject) => {
        pool.query(query, param, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            if (typeof param == 'string') {
                resolve(result[0]);
            }
            else {
                resolve(result);
            }
        });
    });
}
//# sourceMappingURL=bugs.js.map