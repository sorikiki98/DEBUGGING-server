import { Request, Response, NextFunction } from 'express';
import * as CompaniesRepository from '../data/companies.js';
import * as UserRepository from '../data/user.js';
import {
	User,
	Company,
	CompanyInterest,
	ReservationForm,
	ReservationDetail,
} from '../types/index.js';

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
	const reservationId = await CompaniesRepository.reserveCompany(
		req.userId!,
		req.params.company_id,
		reservation
	);

	res.status(201).json(reservationId);
}

export async function checkReservation(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const reservation = await CompaniesRepository.getReservationDetail(
		req.params.reservation_id
	);
	if (reservation == null) {
		return res.sendStatus(404);
	}
	const user = await UserRepository.findUserById(req.userId!);
	const company = await CompaniesRepository.findCompanyById(
		reservation.companyId.toString()
	);
	const reservationDetail = createReservationDetail(reservation, user, company);

	res.status(200).json(reservationDetail);
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
	reservation: ReservationDetail,
	user: User,
	company: Company
) {
	const reservationInfo = { ...reservation, reservationDateTime: new Date() };

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

	return { ...reservationInfo, ...userInfo, ...companyInfo };
}
