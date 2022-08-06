import express from 'express';
import * as BugsController from '../controller/bugs.js';
import { isAuth } from '../middleware/auth.js';

const bugsRouter = express.Router();

bugsRouter.get('/', isAuth, BugsController.getBugs);
bugsRouter.get('/:bug_id', isAuth, BugsController.getBug);
bugsRouter.post('/survey/:bug_id', isAuth, BugsController.survey);

export default bugsRouter;
