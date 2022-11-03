import httpMocks from 'node-mocks-http';
import { faker } from '@faker-js/faker';
import { getBugs, getBug, survey } from '../bugs';
import * as bugsRepository from '../../data/bugs';

describe('Bugs Controller', () => {
	it('load all bugs', async () => {
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

		jest.spyOn(bugsRepository, 'getBugs').mockImplementation(async () => {
			return bugsArray;
		});

		await getBugs(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()).toEqual(bugsArray);
	});

	it('load a bug with given bug id', async () => {
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

		jest.spyOn(bugsRepository, 'getBug').mockImplementation(async () => {
			return bugItem;
		});

		await getBug(request, response, next);

		expect(response.statusCode).toBe(200);
		expect(response._getJSONData()).toEqual(bugItem);
	});

	it('return 404 if a bug with given id does not exist', async () => {
		const request = httpMocks.createRequest({
			params: {
				bug_id: faker.datatype.number({ min: 10000 }),
			},
		});
		const response = httpMocks.createResponse();
		const next = jest.fn();

		jest.spyOn(bugsRepository, 'getBug').mockImplementation(async () => {
			return undefined;
		});

		await getBug(request, response, next);

		expect(response.statusCode).toBe(404);
	});

	it('add survey result', async () => {
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
			.mockImplementation(async () => surveyId);

        await survey(request, response, next);

        expect(response.statusCode).toBe(201);
	});
});
