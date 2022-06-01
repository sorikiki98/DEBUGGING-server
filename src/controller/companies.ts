import { Request, Response, NextFunction } from 'express';
import * as CompaniesRepository from '../data/companies.js';
import { Company } from '../types/index.js';

export async function getCompanies(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const companies = (await CompaniesRepository.getCompanies()) as Company[];
	res.status(200).json(companies);
}
