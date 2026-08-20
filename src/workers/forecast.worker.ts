import { DataSource } from 'typeorm';
import { ForecastJobStatus } from '../types/forecast-job-status';
import DatabaseNotificationService from '../services/db-notification.service';

class ForecastWorker {
  private running = false;

  constructor(
    private readonly dataSource: DataSource,
    private readonly notificationService: DatabaseNotificationService
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
        const forecastJobsRepository = manager.getRepository('ForecastJob');

        const pendingJob = await forecastJobsRepository
          .createQueryBuilder('job')
          .where('job.status = :status', { status: ForecastJobStatus.PENDING })
          .orderBy('job.createdAt', 'ASC')
          .setLock('pessimistic_write')
          .setOnLocked('skip_locked')
          .getOne();

        if (!pendingJob) return null;

        await forecastJobsRepository.update(
          { id: pendingJob?.id },
          { status: ForecastJobStatus.IN_PROGRESS }
        );

        return pendingJob;
      });

      if (!processingJob) break;

      //FEAT: Chamar serviço de previsão
      console.log('Processing job:', processingJob.id);
      await this.dataSource.transaction(async manager => {
        const forecastJobsRepository = manager.getRepository('ForecastJob');

        await forecastJobsRepository.update(
          { id: processingJob.id },
          { status: ForecastJobStatus.COMPLETED, finishedAt: new Date() }
        );
      });
    }
  }
}

export default ForecastWorker;
