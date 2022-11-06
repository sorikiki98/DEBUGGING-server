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
import { getBugs, getBug, survey } from '../bugs.js';
import * as bugsRepository from '../../data/bugs.js';
describe('Bugs Controller', () => {
    it('load all bugs', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest();
        const response = httpMocks.createResponse();
        const next = jest.fn();
        const bugsArray = [
            {
                id: faker.datatype.number(),
                name: faker.animal.insect(),
                appearance: faker.word.adjective(3),
                movement: faker.word.verb(3),
                habitat: faker.word.adjective(3),
                color: faker.color.human(),
                surveyResult: faker.random.words(10),
            },
            {
                id: faker.datatype.number(),
                name: faker.animal.insect(),
                appearance: faker.word.adjective(3),
                movement: faker.word.verb(3),
                habitat: faker.word.adjective(3),
                color: faker.color.human(),
                surveyResult: faker.random.words(10),
            },
        ];
        jest.spyOn(bugsRepository, 'getBugs').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return bugsArray;
        }));
        yield getBugs(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toEqual(bugsArray);
    }));
    it('load a bug with given bug id', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                bug_id: faker.datatype.number({
                    min: 1,
                    max: 6,
                }),
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        const bugItem = {
            id: faker.datatype.number(),
            name: faker.animal.insect(),
            appearance: faker.word.adjective(3),
            movement: faker.word.verb(3),
            habitat: faker.word.adjective(3),
            color: faker.color.human(),
            surveyResult: faker.random.words(10),
        };
        jest.spyOn(bugsRepository, 'getBug').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return bugItem;
        }));
        yield getBug(request, response, next);
        expect(response.statusCode).toBe(200);
        expect(response._getJSONData()).toEqual(bugItem);
    }));
    it('return 404 if a bug with given id does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                bug_id: faker.datatype.number({ min: 10000 }),
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        jest.spyOn(bugsRepository, 'getBug').mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
            return undefined;
        }));
        yield getBug(request, response, next);
        expect(response.statusCode).toBe(404);
    }));
    it('add survey result', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = httpMocks.createRequest({
            params: {
                bug_id: faker.datatype.number({
                    min: 1,
                    max: 6,
                }),
            },
        });
        const response = httpMocks.createResponse();
        const next = jest.fn();
        const surveyId = faker.datatype.number({ min: 1 });
        jest
            .spyOn(bugsRepository, 'addSurveyResult')
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { return surveyId; }));
        yield survey(request, response, next);
        expect(response.statusCode).toBe(201);
    }));
});
//# sourceMappingURL=bugs.test.js.map