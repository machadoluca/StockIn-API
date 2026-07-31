import { Router } from 'express';
import DataSource from '../database/connection';

import User from '../entities/user';
import AuthController from '../controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController(DataSource.getRepository(User));

authRouter.post('/', authController.login);
authRouter.post('/refresh', authController.refresh);

export { authRouter };
