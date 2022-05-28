import { Request, Response } from 'express';

export type Bug = {
	id: number;
	name: string;
	appearance: string;
	movement: string;
	color: string;
	habitat: string;
	surveyResult: string;
};

export type RequestWithBugId = Request<{ bug_id: number }>;

export type ResponseWithBugs = Response<Bug[]>;
export type ResponseWithBug = Response<Bug>;
