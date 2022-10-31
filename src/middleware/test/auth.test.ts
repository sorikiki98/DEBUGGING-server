import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import jwt from 'jsonwebtoken';
import { isAuth } from '../auth';
import * as userRepository from '../../data/user';

jest.mock('jsonwebtoken');
jest.mock('../../data/user');

describe('Auth Middleware', () => {
	it('return 401 without Authorization header', async () => {
		const request = httpMocks.createRequest({
			method: 'GET',
			url: '/mypage',
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		await isAuth(request, response, next);

		expect(response.statusCode).toBe(401);
		expect(next).not.toBeCalled();
		expect(response._getJSONData().message).toBe(
			'Authorization header is invalid.'
		);
	});

	it('return 401 with unsupported Authorizaiton header', async () => {
		const fakeHeader = faker.word.noun(1);
		const fakeToken = faker.datatype.uuid();
		const request = httpMocks.createRequest({
			method: 'GET',
			url: '/mypage',
			headers: {
				Authorization: `${fakeHeader} ${fakeToken}`,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		await isAuth(request, response, next);

		expect(response.statusCode).toBe(401);
		expect(next).not.toBeCalled();
		expect(response._getJSONData().message).toBe(
			'Authorization header is invalid.'
		);
	});

	it('return 401 if it failed to decode token', async () => {
		const validToken = faker.datatype.uuid();
		const request = httpMocks.createRequest({
			method: 'GET',
			url: '/mypage',
			headers: {
				Authorization: `Bearer ${validToken}`,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		const error = new Error('Token is invalid.');
		jwt.verify = jest.fn().mockImplementation((token, secretKey, callback) => {
			callback(error, undefined);
		});

		await isAuth(request, response, next);

		expect(response.statusCode).toBe(401);
		expect(next).not.toBeCalled();
		expect(response._getJSONData().message).toBe('Token is invalid.');
	});

	it('return 401 if user does not exist with given token', async () => {
		const validToken = faker.datatype.uuid();
		const request = httpMocks.createRequest({
			method: 'GET',
			url: '/mypage',
			headers: {
				Authorization: `Bearer ${validToken}`,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		const userId = faker.datatype.number({ min: 10000 });
		jwt.verify = jest.fn().mockImplementation((token, secretKey, callback) => {
			callback(undefined, { userId });
		});

		jest.spyOn(userRepository, 'findUserById').mockImplementation(async (userId) => {
			return undefined;
		});

		await isAuth(request, response, next);

		expect(response.statusCode).toBe(401);
		expect(next).not.toBeCalled();
		expect(response._getJSONData().message).toBe('User does not exist.');
	});

	it('pass a request with a valid token and userId', async () => {
		const validToken = faker.datatype.uuid();
		const request = httpMocks.createRequest({
			method: 'GET',
			url: '/mypage',
			headers: {
				Authorization: `Bearer ${validToken}`,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		const userId = faker.datatype.number({ min: 10000 });
		jwt.verify = jest.fn().mockImplementation((token, secretKey, callback) => {
			callback(undefined, { userId });
		});

		jest.spyOn(userRepository, 'findUserById').mockImplementation(async (userId) => {
			return {
				id: userId,
				userName: faker.internet.userName(),
				password: faker.internet.password(),
				name: faker.name.fullName(),
				contactNumbers: faker.phone.number(),
				email: faker.internet.email(),
			}
		});

		await isAuth(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(next).toBeCalled();
		expect(request.userId).toBeDefined();
	})
});
