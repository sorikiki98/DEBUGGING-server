import httpMocks from 'node-mocks-http';
import { Faker, faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as userRepository from '../../data/user.js';
import * as companiesRepository from '../../data/companies.js';
import * as productsRepository from '../../data/products.js';
import * as bugsRepository from '../../data/bugs.js';
import { createUser, getMyPage, login, remove } from '../../controller/user.js';

jest.mock('bcrypt');
jest.mock('../../data/user');
jest.mock('../../data/companies');
jest.mock('../../data/products', () => {
	const originalModule = jest.requireActual('../../data/products');

	return {
		__esModule: true,
		...originalModule,
		getNumberOfInterestedUsersOfProduct: jest.fn(async () => '1'),
	};
});
jest.mock('../../data/bugs');
describe('User Controller', () => {
	it('create user', async () => {
		const registrationForm = {
			userName: faker.name.firstName(),
			password: faker.internet.password(),
			name: faker.name.fullName(),
			contactNumbers: faker.phone.number(),
			email: faker.internet.email(),
		};
		const request = httpMocks.createRequest({
			body: registrationForm,
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'findUserByName')
			.mockImplementation(async () => undefined);

		jest.spyOn(userRepository, 'createUser').mockImplementation(async () => 1);

		await createUser(request, response, next);

		expect(response.statusCode).toBe(201);
		expect(response._getJSONData()).toMatchObject({
			userName: request.body.userName,
		});
		expect(response._getJSONData().token).toBeDefined();
	});

	it('return 409 if user already exists', async () => {
		const userName = faker.name.firstName();
		const password = faker.internet.password();
		const user = {
			id: faker.datatype.number(),
			userName,
			password,
			name: faker.name.fullName(),
			contactNumbers: faker.phone.number(),
			email: faker.internet.email(),
		};
		const registrationForm = {
			userName,
			password,
			name: faker.name.fullName(),
			contactNumbers: faker.phone.number(),
			email: faker.internet.email(),
		};
		const request = httpMocks.createRequest({
			body: registrationForm,
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'findUserByName')
			.mockImplementation(async () => user);

		await createUser(request, response, next);

		expect(response.statusCode).toBe(409);
	});

	it('succeed to login', async () => {
		const userName = faker.name.firstName();
		const password = faker.internet.password();

		const user = {
			userName,
			password,
			id: faker.datatype.number(),
			name: faker.name.fullName(),
			contactNumbers: faker.phone.number(),
			email: faker.internet.email(),
		};
		const request = httpMocks.createRequest({
			body: {
				userName,
				password,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'findUserByName')
			.mockImplementation(async () => user);

		jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

		await login(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()).toMatchObject({
			userName: request.body.userName,
		});
		expect(response._getJSONData().token).toBeDefined();
	});

	it('return 401 if user does not exist', async () => {
		const request = httpMocks.createRequest({
			userName: faker.name.firstName(),
			password: faker.internet.password(),
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'findUserByName')
			.mockImplementation(async () => undefined);

		await login(request, response, next);

		expect(response.statusCode).toBe(401);
	});

	it('return 401 if password does not match', async () => {
		const userName = faker.name.firstName();
		const actualPassword = faker.internet.password();
		const fakePassword = faker.internet.password();
		const user = {
			id: faker.datatype.number(),
			userName,
			password: actualPassword,
			name: faker.name.fullName(),
			contactNumbers: faker.phone.number(),
			email: faker.internet.email(),
		};
		const request = httpMocks.createRequest({
			userName,
			password: fakePassword,
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'findUserByName')
			.mockImplementation(async () => user);

		jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

		await login(request, response, next);

		expect(response.statusCode).toBe(401);
	});

	it('delete a user', async () => {
		const request = httpMocks.createRequest();
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'deleteUser')
			.mockImplementation(async () => undefined);

		await remove(request, response, next);

		expect(response.statusCode).toBe(204);
	});

	it('load a user information', async () => {
		const user = {
			id: faker.datatype.number(),
			userName: faker.name.fullName(),
			password: faker.internet.password(),
			name: faker.name.fullName(),
			contactNumbers: faker.phone.number(),
			email: faker.internet.email(),
		};
		const numOfReservationsOfUser = faker.datatype.number({ min: 0, max: 30 });
		const numOfInterestedCompaniesOfUser = faker.datatype.number({
			min: 0,
			max: 30,
		});
		const surveyArray = [
			{
				surveyId: faker.datatype.number(),
				bugId: faker.datatype.number(),
				bugName: faker.animal.insect(),
				surveyDate: faker.date.recent(3).toString(),
			},
			{
				surveyId: faker.datatype.number(),
				bugId: faker.datatype.number(),
				bugName: faker.animal.insect(),
				surveyDate: faker.date.recent(3).toString(),
			},
		];
		const productArray = [
			{
				productInterestId: faker.datatype.number(),
				productId: faker.datatype.number(),
				userId: faker.datatype.number(),
				productName: faker.commerce.productName(),
				thumbnail: faker.internet.url(),
				numOfInterestedUsers: faker.datatype.number({ min: 0, max: 30 }),
			},
			{
				productInterestId: faker.datatype.number(),
				productId: faker.datatype.number(),
				userId: faker.datatype.number(),
				productName: faker.commerce.productName(),
				thumbnail: faker.internet.url(),
				numOfInterestedUsers: faker.datatype.number({ min: 0, max: 30 }),
			},
		];
		const reservationArray = [
			{
				reservationId: faker.datatype.number(),
				userId: faker.datatype.number(),
				companyName: faker.company.name(),
				bugName: faker.animal.insect(),
				processState: faker.datatype.number({ min: 0, max: 3 }),
				reservationDateTime: faker.date.recent(3).toString(),
				visitDateTime: faker.date.soon(3).toString(),
			},
			{
				reservationId: faker.datatype.number(),
				userId: faker.datatype.number(),
				companyName: faker.company.name(),
				bugName: faker.animal.insect(),
				processState: faker.datatype.number({ min: 0, max: 3 }),
				reservationDateTime: faker.date.recent(3).toString(),
				visitDateTime: faker.date.soon(3).toString(),
			},
		];

		const request = httpMocks.createRequest();
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(userRepository, 'findUserById')
			.mockImplementation(async () => user);

		jest
			.spyOn(companiesRepository, 'getNumberOfReservationsOfUser')
			.mockImplementation(async () => numOfReservationsOfUser);

		jest
			.spyOn(companiesRepository, 'getNumberOfInterestedCompaniesOfUser')
			.mockImplementation(async () => numOfInterestedCompaniesOfUser);

		jest
			.spyOn(bugsRepository, 'getSurveyItemsOfUser')
			.mockImplementation(async () => surveyArray);

		jest
			.spyOn(productsRepository, 'getProductItemsOfUser')
			.mockImplementation(async () => productArray);

		jest
			.spyOn(companiesRepository, 'getReservationItemsOfUser')
			.mockImplementation(async () => reservationArray);

		await getMyPage(request, response, next);

		const userDetail = {
			...user,
			accumulatedNumOfUsages: numOfReservationsOfUser,
			numberOfInterestedCompanies: numOfInterestedCompaniesOfUser,
			surveyList: surveyArray,
			updatedProductList: productArray,
			reservationList: reservationArray,
		};

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()).toMatchObject(userDetail);
	});
});
