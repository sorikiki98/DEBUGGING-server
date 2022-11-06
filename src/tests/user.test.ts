import axios, { AxiosInstance } from 'axios';
import { faker } from '@faker-js/faker';
import { startServer, stopServer } from '../app.js';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { createNewAccount, createUserDetails } from './auth_utils.js';

describe('User APIs', () => {
	let server: Server;
	let request: AxiosInstance;

	beforeAll(() => {
		server = startServer(0);
		const address = server.address() as AddressInfo;
		request = axios.create({
			baseURL: `http://localhost:${address.port}`,
			validateStatus: null,
		});
	});

	afterAll(async () => {
		await stopServer(server);
	});

	it('POST /signup', async () => {
		const registrationForm = createUserDetails();
		const response = await request.post('/user/signup', registrationForm);

		expect(response.status).toBe(201);
		expect(response.data.token).toBeDefined();
		expect(response.data.userName).toEqual(registrationForm.userName);
	});

	it('POST /login', async () => {
		const user = await createNewAccount(request);
		const loginInFo = { userName: user.userName, password: user.password };
		const response = await request.post('/user/login', loginInFo);

		expect(response.status).toBe(200);
		expect(response.data.token).toBeDefined();
		expect(response.data.userName).toEqual(loginInFo.userName);
	});

	it('return 401 if user is not registered', async () => {
		const randomUserName = faker.name.firstName();
		const randomPassword = faker.internet.password();
		const loginInfo = { userName: randomUserName, password: randomPassword };
		const response = await request.post('/user/login', loginInfo);

		expect(response.status).toBe(401);
	})

	it('return 401 if password does not match', async() => {
		const user = await createNewAccount(request);
		const fakePassword= user.password.toUpperCase();
		const loginInfo = { userName: user.userName, password: fakePassword };
		const response = await request.post('/user/login', loginInfo);

		expect(response.status).toBe(401);
	})
});
