import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import {
	getCompanies,
	reserve,
	checkReservation,
	addCompanyInterest,
	removeCompanyInterest,
} from '../companies';
import * as companiesRepository from '../../data/companies';
import * as userRepository from '../../data/user';

jest.mock('../../data/user');
jest.mock('../../data/companies', () => {
	const originalModule = jest.requireActual('../../data/companies');

	return {
		__esModule: true,
		...originalModule,
		isCompanyInterested: jest.fn(() => 1),
		getNumberOfInterestedUsersOfCompany: jest
			.fn()
			.mockImplementationOnce(() => 3)
			.mockImplementationOnce(() => 4),
	};
});

describe('Companies Controller', () => {
	it('load all companies', async () => {
		const request = httpMocks.createRequest();
		const response = httpMocks.createResponse();
		const next = jest.fn();
		jest
			.spyOn(companiesRepository, 'getCompanies')
			.mockImplementation(async () => companyArray);

			
		await getCompanies(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()[0].isCompanyInterested).toBe(1);
		expect(response._getJSONData()[1].isCompanyInterested).toBe(1);
		expect(response._getJSONData()[0].numOfInterestedUsers).toBe(3);
		expect(response._getJSONData()[1].numOfInterestedUsers).toBe(4);
	});

	it('reserve a company', async () => {
		const request = httpMocks.createRequest({
			body: reservationForm,
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();
		jest
			.spyOn(companiesRepository, 'reserveCompany')
			.mockImplementation(async () => 1);

		await reserve(request, response, next);

		expect(response.statusCode).toBe(201);
		expect(response._getJSONData().reservationId).toBe(1);
	});

	it('load a reservation detail with a given reservation id', async () => {
		const request = httpMocks.createRequest({
			params: {
				reservation_id: 1,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();
		jest
			.spyOn(companiesRepository, 'getReservationDetail')
			.mockImplementation(async () => reservationDetail);

		jest
			.spyOn(companiesRepository, 'findCompanyById')
			.mockImplementation(async () => companyArray[0]);
		jest
			.spyOn(userRepository, 'findUserById')
			.mockImplementation(async () => user);

		await checkReservation(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()).toMatchObject(result);
	});

	it('return 404 if a reservation item does not exist', async () => {
		const request = httpMocks.createRequest({
			params: {
				reservation_id: faker.datatype.number(),
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();
		jest
			.spyOn(companiesRepository, 'getReservationDetail')
			.mockImplementation(async () => undefined);

		await checkReservation(request, response, next);

		expect(response.statusCode).toBe(404);
		expect(response._getJSONData().message).toBe(
			'A reservation id is invalid.'
		);
	});

	it('return 404 if a user item does not exist', async () => {
		const request = httpMocks.createRequest({
			params: {
				reservation_id: faker.datatype.number(),
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();
		jest
			.spyOn(companiesRepository, 'getReservationDetail')
			.mockImplementation(async () => reservationDetail);

		jest
			.spyOn(userRepository, 'findUserById')
			.mockImplementation(async () => undefined);

		await checkReservation(request, response, next);

		expect(response.statusCode).toBe(404);
		expect(response._getJSONData().message).toBe(
			'A user or company does not exist with given a reservation id'
		);
	});

	it('return 404 if a company item does not exist', async () => {
		const request = httpMocks.createRequest({
			params: {
				reservation_id: faker.datatype.number(),
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();
		jest
			.spyOn(companiesRepository, 'getReservationDetail')
			.mockImplementation(async () => reservationDetail);

		jest
			.spyOn(userRepository, 'findUserById')
			.mockImplementation(async () => user);

		jest
			.spyOn(companiesRepository, 'findCompanyById')
			.mockImplementation(async () => undefined);

		await checkReservation(request, response, next);

		expect(response.statusCode).toBe(404);
		expect(response._getJSONData().message).toBe(
			'A user or company does not exist with given a reservation id'
		);
	});

	it('add a company interest item', async () => {
		const request = httpMocks.createRequest({
			params: {
				companyId: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(companiesRepository, 'isCompanyInterested')
			.mockImplementation(async () => {
				return 0;
			});

		const insertId = faker.datatype.number();
		jest
			.spyOn(companiesRepository, 'addCompanyInterest')
			.mockImplementation(async () => {
				return insertId;
			});

		await addCompanyInterest(request, response, next);

		expect(response.statusCode).toBe(201);
		expect(response._getJSONData().insertId).toBe(insertId);
	});

	it('conflict if company interest item is already added', async () => {
		const request = httpMocks.createRequest({
			params: {
				companyId: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(companiesRepository, 'isCompanyInterested')
			.mockImplementation(async () => {
				return 1;
			});

		await addCompanyInterest(request, response, next);

		expect(response.statusCode).toBe(409);
	});

	it('remove a company interest item', async () => {
		const request = httpMocks.createRequest({
			params: {
				companyId: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(companiesRepository, 'isCompanyInterested')
			.mockImplementation(async () => {
				return 1;
			});

		jest
			.spyOn(companiesRepository, 'removeCompanyInterest')
			.mockImplementation(async () => {
				return undefined;
			});

		await removeCompanyInterest(request, response, next);

		expect(response.statusCode).toBe(204);
	})

	it('conflict if company interest item is already removed', async () => {
		const request = httpMocks.createRequest({
			params: {
				companyId: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(companiesRepository, 'isCompanyInterested')
			.mockImplementation(async () => {
				return 0;
			});


		await removeCompanyInterest(request, response, next);

		expect(response.statusCode).toBe(404);
	})
});

const companyArray = [
	{
		id: faker.datatype.number(),
		name: faker.company.name(),
		shortIntro: faker.company.catchPhraseDescriptor(),
		description: faker.lorem.paragraph(),
		contactNumbers: faker.phone.number(),
		killableBugs: faker.animal.insect(),
		availableArea: faker.lorem.words(3),
		availableCounselTime: faker.lorem.words(3),
		isCompanyInterested: 0,
		numOfInterestedUsers: 1,
	},
	{
		id: faker.datatype.number(),
		name: faker.company.name(),
		shortIntro: faker.company.catchPhraseDescriptor(),
		description: faker.lorem.paragraph(),
		contactNumbers: faker.phone.number(),
		killableBugs: faker.animal.insect(),
		availableArea: faker.lorem.words(3),
		availableCounselTime: faker.lorem.words(3),
		isCompanyInterested: 0,
		numOfInterestedUsers: 2,
	},
];

const reservationForm = {
	bugName: faker.animal.insect(),
	firstFoundDate: faker.date.between(
		'2022-11-01T00:00:00.000Z',
		'2022-11-30T00:00:00.000Z'
	),
	firstFoundPlace: faker.word.noun(),
	wantedDate: faker.date.between(
		'2022-11-01T00:00:00.000Z',
		'2022-11-30T00:00:00.000Z'
	),
	wantedTime: faker.datatype.datetime(),
	hasBugBeenShown: false,
};

const reservationDetail = {
	bugName: faker.animal.insect(),
	firstFoundDate: faker.date
		.between('2022-11-01T00:00:00.000Z', '2022-11-30T00:00:00.000Z')
		.toString(),
	firstFoundPlace: faker.word.noun(),
	wantedDate: faker.date
		.between('2022-11-01T00:00:00.000Z', '2022-11-30T00:00:00.000Z')
		.toString(),
	wantedTime: faker.datatype.datetime().toString(),
	hasBugBeenShown: true,
	userId: faker.datatype.number(),
	userName: faker.name.fullName(),
	userContactNumbers: faker.phone.number(),
	userEmail: faker.internet.email(),
	companyId: faker.datatype.number(),
	companyName: faker.company.name(),
	shortIntro: faker.company.bsAdjective(),
	description: faker.company.catchPhrase(),
	companyContactNumbers: faker.phone.number(),
	killableBugs: faker.animal.insect(),
	availableArea: faker.random.words(3),
	availableCounselTime: faker.random.word(),
};

const user = {
	id: faker.datatype.number(),
	userName: faker.name.firstName(),
	password: faker.internet.password(),
	name: faker.name.fullName(),
	contactNumbers: faker.phone.number(),
	email: faker.internet.email(),
};

const result = {
	...reservationDetail,
	userId: user.id,
	userName: user.userName,
	userContactNumbers: user.contactNumbers,
	userEmail: user.email,
	companyId: companyArray[0].id,
	companyName: companyArray[0].name,
	shortIntro: companyArray[0].shortIntro,
	description: companyArray[0].description,
	companyContactNumbers: companyArray[0].contactNumbers,
	killableBugs: companyArray[0].killableBugs,
	availableArea: companyArray[0].availableArea,
	availableCounselTime: companyArray[0].availableCounselTime,
};
