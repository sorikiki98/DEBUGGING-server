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
import * as companiesController from '../companies';
import * as companiesRepository from '../../data/companies';
jest.mock('../companies');
jest.mock('../../data/user');
describe('Companies Controller', () => {
    it('load all companies', () => {
        const request = httpMocks.createRequest();
        const response = httpMocks.createResponse();
        const next = jest.fn();
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
            },
        ];
        jest.spyOn(companiesRepository, 'getCompanies').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return companyArray;
        }));
        jest.spyOn(companiesController, 'updateCompanyProperties').mockImplementation((userId, company) => {
            return companyArray[0];
        });
    });
});
//# sourceMappingURL=companies.test.js.map