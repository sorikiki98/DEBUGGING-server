import { Request, NextFunction, Response } from 'express';
import * as BugsRepository from '../data/bugs.js';
import { Bug } from '../types/index.js';

export async function getBugs(req: Request, res: Response, next: NextFunction) {
	const bugs = (await BugsRepository.getBugs()) as Bug[];
	res.status(200).json(bugs);
}

export async function getBug(req: Request, res: Response, next: NextFunction) {
	const bug = (await BugsRepository.getBug(req.params.bug_id)) as Bug;
	if (bug == null) {
		return res.sendStatus(404);
	}
	res.status(200).json(bug);
}

export async function survey(req: Request, res: Response, next: NextFunction) {
	await BugsRepository.addSurveyResult(req.userId!, req.params.bug_id);

	res.sendStatus(201);
}
