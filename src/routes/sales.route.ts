import { Router } from 'express';
import dataSource from '../database/connection';
import SaleController from '../controllers/sale.controller';
import Order from '../entities/order';

const salesRouter = Router();
const salesController = new SaleController(dataSource.getRepository(Order));

salesRouter.get('/monthly', salesController.getMonthlySales);

export { salesRouter };
