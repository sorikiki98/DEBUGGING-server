import express from 'express';
import * as UserController from '../controller/user.js';

const userRouter = express.Router();

userRouter.post('/signup', UserController.createUser);
userRouter.post('/login', UserController.login);

export default userRouter;
