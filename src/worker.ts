import ForecastWorker from './workers/forecast.worker';
import dataSource from './database/connection';
import DatabaseNotificationService from './services/db-notification.service';

await dataSource.initialize().then(async () => {
  const notificationService = new DatabaseNotificationService();

  const forecastWorker = new ForecastWorker(dataSource, notificationService);
  await forecastWorker.start();

  console.log('Forecast worker is listening for notifications...');
});
