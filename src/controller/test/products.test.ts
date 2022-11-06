import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import {
	getProducts,
	getProduct,
	addProductInterest,
	removeProductInterest,
} from '../products.js';
import * as productsRepository from '../../data/products.js';

jest.mock('../../data/products', () => {
	const originalModule = jest.requireActual('../../data/products');

	return {
		__esModule: true,
		...originalModule,
		isProductInterested: jest.fn(() => 1),
		getNumberOfInterestedUsersOfProduct: jest
			.fn(() => 1)
			.mockImplementationOnce(() => 3)
			.mockImplementationOnce(() => 4),
	};
});
describe('Products Controller', () => {
	it('load all products', async () => {
		const request = httpMocks.createRequest();
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'getProducts')
			.mockImplementation(async () => productArray);

		await getProducts(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()[0].isProductInterested).toBe(1);
		expect(response._getJSONData()[1].isProductInterested).toBe(1);
		expect(response._getJSONData()[0].numOfInterestedUsers).toBe(3);
		expect(response._getJSONData()[1].numOfInterestedUsers).toBe(4);
	});

	it('load a product with a given product id', async () => {
		const request = httpMocks.createRequest({
			params: {
				product_id: 1,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'getProduct')
			.mockImplementation(async () => productArray[0]);

		await getProduct(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()).toMatchObject({
			...productArray[0],
			isProductInterested: 1,
			numOfInterestedUsers: 1,
		});
	});

    it('return 404 if a product does not exist with a given product id', async () => {
		const request = httpMocks.createRequest({
			params: {
				product_id: 1,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'getProduct')
			.mockImplementation(async () => undefined);

		await getProduct(request, response, next);

		expect(response.statusCode).toBe(404);
	});

    it('add a product interest item', async () => {
		const request = httpMocks.createRequest({
			params: {
				product_id: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'isProductInterested')
			.mockImplementation(async () => {
				return 0;
			});

		const insertId = faker.datatype.number();
		jest
			.spyOn(productsRepository, 'addProductInterest')
			.mockImplementation(async () => {
				return insertId;
			});

		await addProductInterest(request, response, next);

		expect(response.statusCode).toBe(201);
		expect(response._getJSONData().insertId).toBe(insertId);
	});

	it('conflict if product interest item is already added', async () => {
		const request = httpMocks.createRequest({
			params: {
				product_id: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'isProductInterested')
			.mockImplementation(async () => {
				return 1;
			});

		await addProductInterest(request, response, next);

		expect(response.statusCode).toBe(409);
	});

	it('remove a product interest item', async () => {
		const request = httpMocks.createRequest({
			params: {
				product_id: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'isProductInterested')
			.mockImplementation(async () => {
				return 1;
			});

		jest
			.spyOn(productsRepository, 'removeProductInterest')
			.mockImplementation(async () => {
				return undefined;
			});

		await removeProductInterest(request, response, next);

		expect(response.statusCode).toBe(204);
	})

	it('conflict if product interest item is already removed', async () => {
		const request = httpMocks.createRequest({
			params: {
				product_id: 2,
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest
			.spyOn(productsRepository, 'isProductInterested')
			.mockImplementation(async () => {
				return 0;
			});


		await removeProductInterest(request, response, next);

		expect(response.statusCode).toBe(404);
	})
});

const productArray = [
	{
		id: faker.datatype.number(),
		name: faker.commerce.productName(),
		type: faker.commerce.productMaterial(),
		shortIntro: faker.commerce.productAdjective(),
		description: faker.commerce.productDescription(),
	},
	{
		id: faker.datatype.number(),
		name: faker.commerce.productName(),
		type: faker.commerce.productMaterial(),
		shortIntro: faker.commerce.productAdjective(),
		description: faker.commerce.productDescription(),
	},
];
