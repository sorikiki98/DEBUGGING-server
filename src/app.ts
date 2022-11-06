import express from 'express';
import { Request, Response, NextFunction } from 'express';
import yamljs from 'yamljs';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';
import { Server } from 'http';
import BugsRouter from './routes/bugs.js';
import UserRouter from './routes/user.js';
import CompaniesRouter from './routes/companies.js';
import ProductsRouter from './routes/products.js';
import { pool } from './db/database.js';


const app = express();

const apiJSDocument = yamljs.load('./api/openapi.yaml');

export const startServer = (port: number) => {
	app.use(express.json());
	app.use(morgan('tiny'));
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiJSDocument));

	app.use('/user', UserRouter);
	app.use('/bugs', BugsRouter);
	app.use('/companies', CompaniesRouter);
	app.use('/products', ProductsRouter);

	app.use('/', (req: Request, res: Response, next: NextFunction) => {
		res.sendStatus(404);
	});

	app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
		if (err) {
			console.log(err);
			res.status(500).send('Internal Server Error...');
		}
	});

	let server: Server;
	server = app.listen(port);

	console.log('Server started...');
	return server;
};

export const stopServer = async (server: Server) => {
	return new Promise(async (resolve, reject) => {
		server.close((error) => {
			if (error) reject(error);
			try {
				pool.end();
			} catch(error) {
				reject(error);
			}
			resolve(null);
		});
		
	});
};
