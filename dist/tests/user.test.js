var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { faker } from '@faker-js/faker';
import { startServer, stopServer } from '../app.js';
describe('User APIs', () => {
    let server;
    let request;
    beforeAll(() => {
        server = startServer(0);
        request = axios.create({
            baseURL: `http://localhost:${server.address().port}`,
            validateStatus: null,
        });
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield stopServer(server);
    }));
    it('POST /signup', () => __awaiter(void 0, void 0, void 0, function* () {
        const registrationForm = {
            userName: faker.name.firstName(),
            password: faker.internet.password(),
            name: faker.name.fullName(),
            contactNumbers: faker.phone.number(),
            email: faker.internet.email(),
        };
        const response = yield request.post('/user/signup', {
            data: registrationForm,
        });
        expect(response.status).toBe(201);
        expect(response.data.token).toBeDefined();
    }));
});
//# sourceMappingURL=user.test.js.map