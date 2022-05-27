import { Request, Response, NextFunction } from 'express';
import * as BugsRepository from '../data/bugs.js';
import { RequestWithBugId } from '../types/requests.js';

export async function getBugs(req: Request, res: Response, next: NextFunction) {
	const bugs = await BugsRepository.getBugs();
	res.status(200).json(bugs);
}

export async function getBug(
	req: RequestWithBugId,
	res: Response,
	next: NextFunction
) {
	const bug = await BugsRepository.getBug(req.params.bug_id);
	if (bug == null) {
        return res.sendStatus(404);
    }
    res.status(200).json(bug);
}
