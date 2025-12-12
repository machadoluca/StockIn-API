import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const authRouter = Router();
const authController = null;

authRouter.post('/', (req, res) =>
  res.json({ message: 'authentication route' })
);

export { authRouter as categoryRouter };
