import { Router } from 'express';
import { forecastHttpConfig } from '../config/http';
import dataSource from '../database/connection';
import ForecastController from '../controllers/forecast.controller';
import Category from '../entities/category';
import ForecastJob from '../entities/forecast-jobs';
import ForecastService from '../services/forecast.service';
import DatabaseNotificationService from '../services/db-notification.service';

const forecastRouter = Router();
const forecastController = new ForecastController({
  services: {
    forecastService: new ForecastService(forecastHttpConfig),
    databaseNotificationService: new DatabaseNotificationService()
  },
  repositories: {
    categoriesRepository: dataSource.getRepository(Category),
    forecastJobsRepository: dataSource.getRepository(ForecastJob)
  }
});

forecastRouter.get('/categories', forecastController.runCategoriesForecast);
forecastRouter.post('/notify', forecastController.notify);
forecastRouter.post('/jobs', forecastController.create);

export { forecastRouter };
