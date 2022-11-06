import express from 'express';
import * as CompaniesController from '../controller/companies.js';
import { isAuth } from '../middleware/auth.js';

const companiesRouter = express.Router();

companiesRouter.get('/', isAuth, CompaniesController.getCompanies);
companiesRouter.post('/reservation/:company_id', isAuth, CompaniesController.reserve);
companiesRouter.get('/reservation/:reservation_id', isAuth, CompaniesController.checkReservation)
companiesRouter.post('/interest/:company_id', isAuth, CompaniesController.addCompanyInterest);
companiesRouter.delete('/interest/:company_id', isAuth, CompaniesController.removeCompanyInterest);

export default companiesRouter;
