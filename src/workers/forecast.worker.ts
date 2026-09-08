import { DataSource } from 'typeorm';
import { ForecastJobStatus } from '../types/forecast-job-status';
import ForecastJob from '../entities/forecast-jobs';
import DatabaseNotificationService from '../services/db-notification.service';
import type ForecastService from '../services/forecast.service';

class ForecastWorker {
  private running = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationService: DatabaseNotificationService,
    private readonly forecastService: ForecastService
  ) {}

  async start() {
    await this.notificationService.listen('forecast_jobs', async payload => {
      console.log('Received notification:', payload);

      this.running = true;
      try {
        await this.processPendingJobs();
      } catch (error) {
        console.error('Error processing pending jobs:', error);
      } finally {
        this.running = false;
      }
    });
  }

  async processPendingJobs() {
    while (this.running) {
      const processingJob = await this.dataSource.transaction(async manager => {
        const forecastJobsRepository = manager.getRepository(ForecastJob);

        const pendingJob = await forecastJobsRepository
          .createQueryBuilder('job')
          .where('job.status = :status', { status: ForecastJobStatus.PENDING })
          .orderBy('job.createdAt', 'ASC')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .getOne();

        if (!pendingJob) return null;

        await forecastJobsRepository.update(
          { id: pendingJob.id },
          { status: ForecastJobStatus.IN_PROGRESS }
        );

        return pendingJob;
      });

      if (!processingJob) break;

      console.log('Processing job:', processingJob.id);
      await this.runForecast(processingJob);
    }
  }

  async runForecast(job: ForecastJob) {
    const forecastData = await this.dataSource.query(
      `
        SELECT
            date(s.created_at) AS ds,
            SUM(s.quantity) AS y
        FROM sales s
        JOIN products p ON p.id = s.product_id
        WHERE p.category_id = $1
        AND s.status IN (
          'Shipped',
          'Shipping',
          'Shipped - Picked Up',
          'Shipped - Out for Delivery',
          'Shipped - Delivered to Buyer',
          'Pending - Waiting for Pick Up'
        )
        GROUP BY date(s.created_at)
        ORDER BY ds;
      `,
      [job.categoryId]
    );

    const response = await this.forecastService.forecast(forecastData);
    console.log('Forecast response:', response.data);

    await this.dataSource.getRepository(ForecastJob).update(
      { id: job.id },
      {
        status: ForecastJobStatus.COMPLETED,
        finishedAt: new Date(),
        metrics: response.data.metrics
      }
    );
  }
}

export default ForecastWorker;
