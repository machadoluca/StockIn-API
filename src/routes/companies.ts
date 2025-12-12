import { Router } from 'express';
import CompanyController from '../controllers/company.controller';

const companyRouter = Router();
const companyController = new CompanyController();

companyRouter.get('/:companyId/categories', companyController.getCategories);

companyRouter.get('/:companyId/products', companyController.getProducts);

companyRouter.get(
  '/:companyId/forecast',
  companyController.getLastForecastUpdate
);

companyRouter.post('/', companyController.create);

export { companyRouter };
