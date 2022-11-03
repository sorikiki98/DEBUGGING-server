import mysql from 'mysql';
import { config } from '../config';
export const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    port: config.db.port,
});
//# sourceMappingURL=database.js.map