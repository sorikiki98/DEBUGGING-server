import express from 'express';
import * as UserController from '../controller/user.js';
import { isAuth } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup', UserController.createUser);
userRouter.post('/login', UserController.login);
userRouter.delete('/', isAuth, UserController.remove);

export default userRouter;
