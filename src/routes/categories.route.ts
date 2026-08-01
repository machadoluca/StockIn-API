import { Router } from 'express';
import DataSource from '../database/connection';

import Category from '../entities/category';
import CategoryController from '../controllers/categories.controller';

const categoryRouter = Router();
const categoryController = new CategoryController(
  DataSource.getRepository(Category)
);

categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:categoryId', categoryController.getCategory);
categoryRouter.post('/', categoryController.create);

export { categoryRouter };
