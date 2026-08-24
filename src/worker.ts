import { forecastHttpClient } from './config/http';
import dataSource from './database/connection';
import ForecastWorker from './workers/forecast.worker';
import DatabaseNotificationService from './services/db-notification.service';
import ForecastService from './services/forecast.service';

await dataSource.initialize().then(async () => {
  const notificationService = new DatabaseNotificationService();
  const forecastService = new ForecastService(forecastHttpClient);

  const forecastWorker = new ForecastWorker(
    dataSource,
    notificationService,
    forecastService
  );
  await forecastWorker.start();

  console.log('Forecast worker is listening for notifications...');
});
