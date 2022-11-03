import express from 'express';
import * as BugsController from '../controller/bugs';
import { isAuth } from '../middleware/auth';
const bugsRouter = express.Router();
bugsRouter.get('/', isAuth, BugsController.getBugs);
bugsRouter.get('/:bug_id', isAuth, BugsController.getBug);
bugsRouter.post('/survey/:bug_id', isAuth, BugsController.survey);
export default bugsRouter;
//# sourceMappingURL=bugs.js.map