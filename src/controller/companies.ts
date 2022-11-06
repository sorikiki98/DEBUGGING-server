import { Request, Response, NextFunction } from 'express';
import * as CompaniesRepository from '../data/companies.js';
import * as UserRepository from '../data/user.js';
import {
	User,
	Company,
	ReservationForm,
	ReservationDetail,
} from '../types/index.js';

export async function getCompanies(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const companies = await CompaniesRepository.getCompanies();

	const result = await Promise.all(
		companies.map(async (company) => {
			return updateCompanyProperties(req.userId!, company);
		})
	);

	res.status(200).json(result);
}

export async function reserve(req: Request, res: Response, next: NextFunction) {
	const reservation = req.body as ReservationForm;
	const reservationId = await CompaniesRepository.reserveCompany(
		req.userId!,
		req.params.company_id,
		reservation
	);

	res.status(201).json({ reservationId });
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
		return res.status(404).json({ message: 'A reservation id is invalid.' });
	}
	const user = await UserRepository.findUserById(req.userId!);
	const company = await CompaniesRepository.findCompanyById(
		reservation.companyId.toString()
	);

	if (user && company) {
		const reservationDetail = createReservationDetail(
			reservation,
			user,
			company
		);
		return res.status(200).json(reservationDetail);
	}

	res.status(404).json({
		message: 'A user or company does not exist with given a reservation id',
	});
}

export async function addCompanyInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.userId!;
	const companyId = req.params.company_id;
	if (await isCompanyInterested(userId, companyId)) {
		return res.sendStatus(409);
	}
	const insertId = await CompaniesRepository.addCompanyInterest(
		userId,
		companyId
	);
	res.status(201).json({ insertId });
}

export async function removeCompanyInterest(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const userId = req.userId!;
	const companyId = req.params.company_id;
	if (!(await isCompanyInterested(userId, companyId))) {
		return res.status(404);
	}
	await CompaniesRepository.removeCompanyInterest(userId, companyId);
	res.sendStatus(204);
}

async function updateCompanyProperties(userId: number, company: Company) {
	await updateIsCompanyInterested(userId, company);
	await updateNumOfInterestedUsers(company);
	return company;
}

async function updateIsCompanyInterested(userId: number, company: Company) {
	company!.isCompanyInterested = await isCompanyInterested(
		userId,
		company!.id.toString()
	);
}

async function updateNumOfInterestedUsers(company: Company) {
	company!.numOfInterestedUsers =
		await CompaniesRepository.getNumberOfInterestedUsersOfCompany(
			company!.id.toString()
		);
}

export async function isCompanyInterested(
	userId: number,
	companyId: string
): Promise<number> {
	return CompaniesRepository.isCompanyInterested(userId, companyId);
}

function createReservationDetail(
	reservation: ReservationDetail,
	user: User,
	company: Company
) {
	const reservationInfo = { ...reservation, reservationDateTime: new Date() };

	const userInfo = {
		userId: user!.id,
		userName: user!.userName,
		userContactNumbers: user!.contactNumbers,
		userEmail: user!.email,
		userAddress: user!.address,
		sizeOfHouse: user!.sizeOfHouse,
		numOfRooms: user!.numOfRooms,
	};

	const companyInfo = {
		companyId: company!.id,
		companyName: company!.name,
		shortIntro: company!.shortIntro,
		description: company!.description,
		companyContactNumbers: company!.contactNumbers,
		killableBugs: company!.killableBugs,
		availableArea: company!.availableArea,
		availableCounselTime: company!.availableCounselTime,
		thumbnail: company!.thumbnail,
	};

	return { ...reservationInfo, ...userInfo, ...companyInfo };
}
