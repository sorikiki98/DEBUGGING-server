import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as UserRepository from '../data/user.js';
import * as BugsRepository from '../data/bugs.js';
import * as CompanyRepository from '../data/companies.js';
import * as ProductRepository from '../data/products.js';
import * as ProductController from '../controller/products.js';
import { config } from '../config.js';
import { UserRegistration, UserLogin, ProductItem } from '../types/index.js';

export async function createUser(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { userName, password } = req.body as UserRegistration;
	const user = await UserRepository.findUserByName(userName);
	if (user) {
		return res.sendStatus(409);
	}

	const hashed = await bcrypt.hash(
		password,
		parseInt(config.bcrypt.saltsRound)
	);
	const userId = await UserRepository.createUser({
		...req.body,
		password: hashed,
	});

	const token = createJWT(userId);

	res.status(201).json({
		token,
		userName,
	});
}

export async function login(req: Request, res: Response, next: NextFunction) {
	const { userName, password } = req.body as UserLogin;
	const user = await UserRepository.findUserByName(userName);
	if (!user) return res.sendStatus(401);

	const match = await bcrypt.compare(password, user.password);
	if (!match) return res.sendStatus(401);

	const token = createJWT(user.id);

	res.status(200).json({
		token,
		userName,
	});
}

export async function remove(req: Request, res: Response, next: NextFunction) {
	await UserRepository.deleteUser(req.userId!);
	res.sendStatus(204);
}

export async function getMyPage(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { findUserById } = UserRepository;
	const {
		getNumberOfReservationsOfUser,
		getNumberOfInterestedCompaniesOfUser,
		getReservationItemsOfUser,
	} = CompanyRepository;
	const { getSurveyItemsOfUser } = BugsRepository;
	const { getProductItemsOfUser } = ProductRepository;

	const user = await findUserById(req.userId!);
	const accumulatedNumOfUsages = await getNumberOfReservationsOfUser(
		req.userId!
	);
	const numberOfInterestedCompanies =
		await getNumberOfInterestedCompaniesOfUser(req.userId!);
	const surveyList = await getSurveyItemsOfUser(req.userId!);
	const productList = await getProductItemsOfUser(req.userId!);
	const reservationList = await getReservationItemsOfUser(req.userId!);

	let updatedProductList;
	await Promise.all(
		productList.map(async (product) => {
			return updateNumOfInterestedUsers(product);
		})
	).then((result) => updatedProductList = result);

	const userDetail = {
		...user,
		accumulatedNumOfUsages,
		numberOfInterestedCompanies,
		surveyList,
		updatedProductList,
		reservationList,
	};

	res.status(200).json(userDetail);
}

function createJWT(userId: number): string {
	return jwt.sign({ userId }, config.jwt.privateKey, {
		expiresIn: config.jwt.expirSecs,
	});
}

async function updateNumOfInterestedUsers(product: ProductItem): Promise<ProductItem> {
	const numOfUsers =
		await ProductRepository.getNumberOfInterestedUsersOfProduct(
			product.productId.toString()
		);
	product.numOfInterestedUsers = numOfUsers;
	return product;
}