import { Router } from 'express';
import dataSource from '../database/connection';

import Category from '../entities/category';
import CategoryController from '../controllers/category.controller';

const categoriesRouter = Router();
const categoryController = new CategoryController(
  dataSource.getRepository(Category)
);

categoriesRouter.get('/', categoryController.getCategories);
categoriesRouter.get('/:categoryId', categoryController.getCategory);
categoriesRouter.post('/', categoryController.create);

export { categoriesRouter };
