import { Request, Response, NextFunction } from 'express';
import * as CompaniesRepository from '../data/companies.js';
import * as UserRepository from '../data/user.js';
import { Company, ReservationForm } from '../types/index.js';

export async function getCompanies(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const companies = (await CompaniesRepository.getCompanies()) as Company[];
	res.status(200).json(companies);
}

export async function reserve(req: Request, res: Response, next: NextFunction) {
	let reservationInfo = req.body as ReservationForm;
	reservationInfo = { ...reservationInfo, reservationDateTime: new Date() };

	const id = await CompaniesRepository.reserveCompany(
		req.userId!,
		req.params.company_id,
		reservationInfo
	);

	const user = await UserRepository.findUserById(req.userId!);
	const userInfo = {
		userId: user.id,
		userName: user.userName,
		userContactNumbers: user.contactNumbers,
		userEmail: user.email,
		userAddress: user.address,
		sizeOfHouse: user.sizeOfHouse,
		numOfRooms: user.numOfRooms,
	};

	const company = await CompaniesRepository.findCompanyById(
		req.params.company_id
	);
	const companyInfo = {
		companyId: company.id,
		companyName: company.name,
		shortIntro: company.shortIntro,
		description: company.description,
		companyContactNumbers: company.contactNumbers,
		killableBugs: company.killableBugs,
		availableArea: company.availableArea,
		availableCounselTime: company.availableCounselTime,
		thumbnail: company.thumbnail,
	};

	const reservationDetail = {
		id,
		...reservationInfo,
		...userInfo,
		...companyInfo,
	};

	res.status(201).json(reservationDetail);
}
