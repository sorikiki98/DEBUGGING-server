import { Request } from 'express';

export type RequestWithBugId = Request<{ bug_id: number }>;