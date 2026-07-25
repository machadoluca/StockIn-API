import { Router } from 'express';

import User from '../entities/user';
import DataSource from '../database/connection';
import UserController from '../controllers/user.controller';

const userRouter = Router();
const userController = new UserController(DataSource.getRepository(User));

userRouter.post('/create', userController.create);

export { userRouter };
