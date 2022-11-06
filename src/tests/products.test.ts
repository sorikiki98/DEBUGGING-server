import axios, { AxiosInstance } from 'axios';
import { startServer, stopServer } from '../app.js';
import { Server } from 'http';
import { AddressInfo } from 'net';
import { createNewAccount } from './auth_utils.js';
import { faker } from '@faker-js/faker';

describe('Products APIs', () => {
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

	it('GET /products', async () => {
		const user = await createNewAccount(request);
		const response = await request.get('/products', {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});

		expect(response.status).toBe(200);
		expect(response.data.length).toBeGreaterThan(0);
	});

	it('GET /products/:product_id', async () => {
		const user = await createNewAccount(request);
        const productId = 1;
		const response = await request.get(`/products/${productId}`, {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});

		expect(response.status).toBe(200);
		expect(response.data).toBeDefined();
	});

	it('return 404 with invalid product id', async () => {
		const user = await createNewAccount(request);
        const fakeProductId = faker.datatype.number({ min: 10000 });
		const response = await request.get(`/products/${fakeProductId}`, {
			headers: {
				Authorization: `Bearer ${user.token}`,
			},
		});
        
		expect(response.status).toBe(404);
	});
});
