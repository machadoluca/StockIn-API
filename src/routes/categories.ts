import { Router } from 'express';
import CategoryController from '../controllers/category.controller.js';

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get('/:categoryId', categoryController.getCategory);

categoryRouter.post('/', categoryController.create);

export { categoryRouter };
