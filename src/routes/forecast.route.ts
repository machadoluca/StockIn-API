import { Router } from 'express';
import { forecastHttpConfig } from '../config/http';

import DataSource from '../database/connection';
import Category from '../entities/category';
import ForecastService from '../services/forecast.service';
import ForecastController from '../controllers/forecast.controller';

const forecastRouter = Router();
const forecastController = new ForecastController({
  services: {
    forecastService: new ForecastService(forecastHttpConfig)
  },
  repositories: {
    categoriesRepository: DataSource.getRepository(Category)
  }
});

forecastRouter.get('/categories', forecastController.runCategoriesForecast);
// forecastsRouter.get('/categories', async (request, response) => {});

export { forecastRouter };
