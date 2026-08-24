import { Router } from 'express';
import dataSource from '../database/connection';
import ForecastController from '../controllers/forecast.controller';
import Category from '../entities/category';
import ForecastJob from '../entities/forecast-jobs';
import DatabaseNotificationService from '../services/db-notification.service';
import { forecastHttpClient } from '../config/http';

const forecastRouter = Router();
const forecastController = new ForecastController({
  services: {
    databaseNotificationService: new DatabaseNotificationService()
  },
  repositories: {
    categoriesRepository: dataSource.getRepository(Category),
    forecastJobsRepository: dataSource.getRepository(ForecastJob)
  }
});

forecastRouter.get('/ping', async (_, res) => {
  const response = await forecastHttpClient.get('/');

  return res.status(200).send({ message: response.data });
});
forecastRouter.post('/notify', forecastController.notify);
forecastRouter.post('/jobs', forecastController.create);

export { forecastRouter };
