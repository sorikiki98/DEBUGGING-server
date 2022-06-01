import { pool } from '../db/database.js';
// Todo: integrate with createPromiseWithBug
export function getBugs() {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM bugs', (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result);
        });
    });
}
export function getBug(bugId) {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM bugs WHERE id = ?', bugId, (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
                reject(error);
            }
            resolve(result[0]);
        });
    });
}
//# sourceMappingURL=bugs.js.map