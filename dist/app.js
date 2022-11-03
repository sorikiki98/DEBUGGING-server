import express from 'express';
import yamljs from 'yamljs';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';
import BugsRouter from './routes/bugs';
import UserRouter from './routes/user';
import CompaniesRouter from './routes/companies';
import ProductsRouter from './routes/products';
import { config } from './config';
const app = express();
const apiJSDocument = yamljs.load('./api/openapi.yaml');
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
app.listen(config.host.port);
//# sourceMappingURL=app.js.map