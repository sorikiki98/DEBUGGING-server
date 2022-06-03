import { Request, Response, NextFunction } from 'express';
import * as CompaniesRepository from '../data/companies.js';
import * as UserRepository from '../data/user.js';
import { User, Company, CompanyInterest, ReservationForm } from '../types/index.js';

export async function getCompanies(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { getCompanies, getCompanyInterestsByUserId } = CompaniesRepository;
	const companies = await getCompanies();
	const companyInterests = await getCompanyInterestsByUserId(req.userId!);

	updateCompanyInterested(companies, companyInterests);
	res.status(200).json(companies);
}

export async function reserve(req: Request, res: Response, next: NextFunction) {
	const reservation = req.body as ReservationForm;
	const id = await CompaniesRepository.reserveCompany(
		req.userId!,
		req.params.company_id,
		reservation
	);
	const user = await UserRepository.findUserById(req.userId!);
	const company = await CompaniesRepository.findCompanyById(
		req.params.company_id
	);
	const reservationDetail = createReservationDetail(id, user, company, reservation);
	
	res.status(201).json(reservationDetail);
}

export async function addCompanyInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (await isCompanyInterested(req)) {
		return res.sendStatus(409);
	}
	await CompaniesRepository.addCompanyInterest(
		req.userId!,
		req.params.company_id
	);
	res.sendStatus(201);
}

export async function removeCompanyInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (!(await isCompanyInterested(req))) {
		return res.sendStatus(404);
	}
	await CompaniesRepository.removeCompanyInterest(
		req.userId!,
		req.params.company_id
	);
	res.sendStatus(204);
}

async function isCompanyInterested(req: Request): Promise<boolean> {
	return await CompaniesRepository.findCompanyInterestById(
		req.userId!,
		req.params.company_id
	);
}

function updateCompanyInterested(
	companies: Company[],
	companyInterests: CompanyInterest[]
) {
	const interestedCompanyIds = companyInterests.map(
		(companyInterest) => companyInterest.companyId
	);
	companies.forEach(
		(company) =>
			(company.isCompanyInterested = interestedCompanyIds.includes(company.id))
	);
}

function createReservationDetail(
	id: number,
	user: User,
	company: Company,
	reservation: ReservationForm
) {
	const userInfo = {
		userId: user.id,
		userName: user.userName,
		userContactNumbers: user.contactNumbers,
		userEmail: user.email,
		userAddress: user.address,
		sizeOfHouse: user.sizeOfHouse,
		numOfRooms: user.numOfRooms,
	};

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

	const reservationInfo = { ...reservation, reservationDateTime: new Date() };

	return { id, ...userInfo, ...companyInfo, ...reservationInfo };
}
