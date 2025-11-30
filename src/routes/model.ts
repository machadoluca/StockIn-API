import { Router } from 'express';
import ForecastController from '../controllers/forecast.controller.js';

const modelRouter = Router();
const forecastController = new ForecastController();

modelRouter.post('/predict', forecastController.predict);

export { modelRouter };
