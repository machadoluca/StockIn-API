import { Router } from 'express';
import ForecastController from '../controllers/forecast.controller';

const modelRouter = Router();
const forecastController = new ForecastController();

modelRouter.post('/predict/category', forecastController.predictCategory);

modelRouter.post('/predict/product', forecastController.predictProduct);

modelRouter.post('/analysis/report', forecastController.generateAnalysisReport);

export { modelRouter };
