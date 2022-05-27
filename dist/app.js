import express from 'express';
import yamljs from 'yamljs';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import BugsRouter from './routes/bugs.js';
import UserRouter from './routes/user.js';
const app = express();
const apiJSDocument = yamljs.load('./api/openapi.yaml');
app.use(express.json());
app.use(morgan('tiny'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiJSDocument));
app.use('/user', UserRouter);
app.use('/bugs', BugsRouter);
app.use('/', (req, res, next) => {
    res.sendStatus(404);
});
app.use((err, req, res, next) => {
    if (err) {
        res.status(500).send('Internal Server Error...');
    }
});
app.listen(8080);
//# sourceMappingURL=app.js.map