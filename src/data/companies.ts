import { pool } from "../db/database.js";
import { Company } from "../types/index.js";

export function getCompanies(): Promise<Company[]> {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM companies', (error, result) => {
            if (error) {
                console.log(error.sqlMessage);
				reject(error);
            }
            resolve(result);
        })
    })
}