import express from 'express';
import * as BugsController from '../controller/bugs.js';

const bugsRouter = express.Router();

bugsRouter.get('/', BugsController.getBugs);
bugsRouter.get('/:bug_id', BugsController.getBug);


export default bugsRouter;
