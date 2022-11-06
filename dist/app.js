var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import yamljs from 'yamljs';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';
import BugsRouter from './routes/bugs.js';
import UserRouter from './routes/user.js';
import CompaniesRouter from './routes/companies.js';
import ProductsRouter from './routes/products.js';
import { pool } from './db/database.js';
const app = express();
const apiJSDocument = yamljs.load('./api/openapi.yaml');
export const startServer = (port) => {
    app.use(express.json());
    app.use(morgan('tiny'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiJSDocument));
    app.use('/user', UserRouter);
    app.use('/bugs', BugsRouter);
    app.use('/companies', CompaniesRouter);
    app.use('/products', ProductsRouter);
    app.use('/', (req, res, next) => {
        res.sendStatus(404);
    });
    app.use((err, req, res, next) => {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error...');
        }
    });
    let server;
    server = app.listen(port);
    console.log('Server started...');
    return server;
};
export const stopServer = (server) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        server.close((error) => {
            if (error)
                reject(error);
            try {
                pool.end();
            }
            catch (error) {
                reject(error);
            }
            resolve(null);
        });
    }));
});
//# sourceMappingURL=app.js.map