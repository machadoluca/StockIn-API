import { Router } from 'express';
import ProductController from '../controllers/product.controller.js';

const productRouter = Router();
const productController = new ProductController();

productRouter.get('/', productController.getProducts);

productRouter.get('/:productId', productController.getProduct);

productRouter.post('/', productController.create);

export { productRouter };
