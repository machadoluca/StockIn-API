import { Router } from 'express';
import dataSource from '../database/connection';
import SaleController from '../controllers/sale.controller';
import Sale from '../entities/sale';

const salesRouter = Router();
const salesController = new SaleController(dataSource.getRepository(Sale));

salesRouter.get('/monthly', salesController.getMonthlySales);

export { salesRouter };
