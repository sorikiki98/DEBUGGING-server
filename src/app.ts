import express from 'express';
import mysql from 'mysql';
import yamljs from 'yamljs';
import swaggerUi from 'swagger-ui-express'

const app = express();
const pool = mysql.createPool({
	host: 'localhost',
	user: 'root',
	password: 'Kyesolkim0626!',
	database: 'debugging',
	port: 3306,
});

pool.getConnection((err) => {
	if (err) {
		console.log(err);
		return;
	}
	console.log('Connected..');
});

const apiJSDocument = yamljs.load('./api/openapi.yaml');

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiJSDocument));
app.listen(8080);
