import express from 'express';
import * as CompaniesController from '../controller/companies.js';
import { isAuth } from '../middleware/auth.js';

const companiesRouter = express.Router();

companiesRouter.get('/', isAuth, CompaniesController.getCompanies);
companiesRouter.post('/reservation/:company_id', isAuth, CompaniesController.reserve);

export default companiesRouter;
