import mysql from 'mysql';

export const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Kyesolkim0626!',
	database: 'debugging',
	port: 3306,
})