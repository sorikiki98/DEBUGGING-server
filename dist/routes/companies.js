import express from 'express';
import * as CompaniesController from '../controller/companies.js';
import { isAuth } from '../middleware/auth.js';
const companiesRouter = express.Router();
companiesRouter.get('/', isAuth, CompaniesController.getCompanies);
export default companiesRouter;
//# sourceMappingURL=companies.js.map