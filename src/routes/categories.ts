import { Router } from 'express';
import CategoryController from '../controllers/category.controller';

const categoryRouter = Router();
const categoryController = new CategoryController();

categoryRouter.get('/:categoryId', categoryController.getCategory);

categoryRouter.get('/:companyId', categoryController.getCategoriesByCompanyId);

categoryRouter.post('/', categoryController.create);

export { categoryRouter };
