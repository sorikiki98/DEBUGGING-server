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
import jwt from 'jsonwebtoken';
import { isAuth } from '../auth.js';
import * as userRepository from '../../data/user.js';
jest.mock('jsonwebtoken');
jest.mock('../../data/user');
describe('Auth Middleware', () => {
    it('return 401 without Authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            method: 'GET',
            url: '/mypage',
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        yield isAuth(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(next).not.toBeCalled();
        expect(response._getJSONData().message).toBe('Authorization header is invalid.');
    }));
    it('return 401 with unsupported Authorizaiton header', () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield isAuth(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(next).not.toBeCalled();
        expect(response._getJSONData().message).toBe('Authorization header is invalid.');
    }));
    it('return 401 if it failed to decode token', () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield isAuth(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(next).not.toBeCalled();
        expect(response._getJSONData().message).toBe('Token is invalid.');
    }));
    it('return 401 if user does not exist with given token', () => __awaiter(void 0, void 0, void 0, function* () {
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
        jest.spyOn(userRepository, 'findUserById').mockImplementation((userId) => __awaiter(void 0, void 0, void 0, function* () {
            return undefined;
        }));
        yield isAuth(request, response, next);
        expect(response.statusCode).toBe(401);
        expect(next).not.toBeCalled();
        expect(response._getJSONData().message).toBe('User does not exist.');
    }));
    it('pass a request with a valid token and userId', () => __awaiter(void 0, void 0, void 0, function* () {
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
        jest.spyOn(userRepository, 'findUserById').mockImplementation((userId) => __awaiter(void 0, void 0, void 0, function* () {
            return {
                id: userId,
                userName: faker.internet.userName(),
                password: faker.internet.password(),
                name: faker.name.fullName(),
                contactNumbers: faker.phone.number(),
                email: faker.internet.email(),
            };
        }));
        yield isAuth(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(next).toBeCalled();
        expect(request.userId).toBeDefined();
    }));
});
//# sourceMappingURL=auth.test.js.map