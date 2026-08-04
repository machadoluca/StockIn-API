import { Router } from 'express';

import User from '../entities/user';
import dataSource from '../database/connection';
import UserController from '../controllers/user.controller';

const userRouter = Router();
const userController = new UserController(dataSource.getRepository(User));

userRouter.post('/create', userController.create);

export { userRouter };
