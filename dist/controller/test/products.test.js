var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import { getProducts, getProduct, addProductInterest, removeProductInterest, } from '../products.js';
import * as productsRepository from '../../data/products.js';
jest.mock('../../data/products', () => {
    const originalModule = jest.requireActual('../../data/products');
    return Object.assign(Object.assign({ __esModule: true }, originalModule), { isProductInterested: jest.fn(() => 1), getNumberOfInterestedUsersOfProduct: jest
            .fn(() => 1)
            .mockImplementationOnce(() => 3)
            .mockImplementationOnce(() => 4) });
});
describe('Products Controller', () => {
    it('load all products', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest();
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'getProducts')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return productArray; }));
        yield getProducts(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()[0].isProductInterested).toBe(1);
        expect(response._getJSONData()[1].isProductInterested).toBe(1);
        expect(response._getJSONData()[0].numOfInterestedUsers).toBe(3);
        expect(response._getJSONData()[1].numOfInterestedUsers).toBe(4);
    }));
    it('load a product with a given product id', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                product_id: 1,
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'getProduct')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return productArray[0]; }));
        yield getProduct(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toMatchObject(Object.assign(Object.assign({}, productArray[0]), { isProductInterested: 1, numOfInterestedUsers: 1 }));
    }));
    it('return 404 if a product does not exist with a given product id', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                product_id: 1,
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'getProduct')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return undefined; }));
        yield getProduct(request, response, next);
        expect(response.statusCode).toBe(404);
    }));
    it('add a product interest item', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                product_id: 2,
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'isProductInterested')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return 0;
        }));
        const insertId = faker.datatype.number();
        jest
            .spyOn(productsRepository, 'addProductInterest')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return insertId;
        }));
        yield addProductInterest(request, response, next);
        expect(response.statusCode).toBe(201);
        expect(response._getJSONData().insertId).toBe(insertId);
    }));
    it('conflict if product interest item is already added', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                product_id: 2,
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'isProductInterested')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return 1;
        }));
        yield addProductInterest(request, response, next);
        expect(response.statusCode).toBe(409);
    }));
    it('remove a product interest item', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                product_id: 2,
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'isProductInterested')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return 1;
        }));
        jest
            .spyOn(productsRepository, 'removeProductInterest')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return undefined;
        }));
        yield removeProductInterest(request, response, next);
        expect(response.statusCode).toBe(204);
    }));
    it('conflict if product interest item is already removed', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                product_id: 2,
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest
            .spyOn(productsRepository, 'isProductInterested')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return 0;
        }));
        yield removeProductInterest(request, response, next);
        expect(response.statusCode).toBe(404);
    }));
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
//# sourceMappingURL=products.test.js.map