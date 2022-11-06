import mysql from 'mysql';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

export default async function teardown() {
    return new Promise((resolve, reject) => {
        const pool = mysql.createPool({
            host: process.env['DB_HOST'],
            user: process.env['DB_USER'],
            password: process.env['DB_PASSWORD'],
            database: process.env['DB_DATABASE'],
        });
        
        pool.query('DELETE FROM users', (error) => {
            if (error) {
                console.log(error);
                reject(error);
            }
            console.log('DB is cleared');
            resolve(null);
        })
    })
}
