import type { Request, Response } from 'express';
import { Repository } from 'typeorm';
import z from 'zod';

import { ForecastJobStatus } from '../types/forecast-job-status';
import AppError from '../utils/error';

import ForecastJob from '../entities/forecast-jobs';
import ForecastService from '../services/forecast.service';
import Category from '../entities/category';
// import Company from '../entities/company';
// import openaiService from '../services/openai.service';
// import pdfService from '../services/pdf.service';
import DatabaseNotificationService from '../services/db-notification.service';

interface ForecastControllerDependencies {
  services: {
    databaseNotificationService: DatabaseNotificationService;
  };
  repositories: {
    categoriesRepository: Repository<Category>;
    forecastJobsRepository: Repository<ForecastJob>;
  };
}

class ForecastController {
  constructor(private readonly deps: ForecastControllerDependencies) {}

  // runCategoriesForecast = async (request: Request, response: Response) => {
  //   const forecastCategorySchema = z.object({
  //     categoryId: z.string()
  //   });
  //   const { categoryId } = forecastCategorySchema.parse(request.body);
  //   const category =
  //     await this.deps.repositories.categoriesRepository.findOneBy({
  //       id: categoryId
  //     });
  //   if (!category) throw new AppError('Category not found', 404);
  //   const forecastModelResponse =
  //     await this.deps.services.forecastService.forecastCategory(categoryId);
  //   return response.json({ message: forecastModelResponse.data });
  //   const data = await modelResponse.json();
  //   const forecastRun = await DataSource.getRepository(ForecastRun).save({
  //     category,
  //     metrics: data.metrics
  //   });
  //   const formattedForecasts = data.forecast.map(
  //     (forecast: {
  //       ds: string;
  //       yhat: number;
  //       yhat_lower: number;
  //       yhat_upper: number;
  //     }) => {
  //       return {
  //         run: forecastRun.id,
  //         date: new Date(forecast.ds).toISOString(),
  //         predicted: forecast.yhat,
  //         predictedLower: forecast.yhat_lower,
  //         predictedUpper: forecast.yhat_upper
  //       };
  //     }
  //   );
  //   const savedForecasts =
  //     await DataSource.getRepository(Forecast).save(formattedForecasts);
  //   return response.status(200).json(formatData);
  // };

  // public generateAnalysisReport: RequestHandler = async (request, response) => {
  //   const generateReportSchema = z.object({
  //     company_id: z.string(),
  //     category_id: z.string()
  //   });

  //   try {
  //     generateReportSchema.parse(request.body);

  //     const {
  //       company_id: companyId,
  //       category_id: categoryId
  //     }: z.infer<typeof generateReportSchema> = request.body;

  //     const company = await DataSource.getRepository(Company).findOneBy({
  //       id: companyId
  //     });

  //     if (!company) {
  //       return response.status(400).json({ message: 'company not found' });
  //     }

  //     const category = await DataSource.getRepository(Category).findOneBy({
  //       id: categoryId
  //     });

  //     if (!category) {
  //       return response.status(400).json({ message: 'category not found' });
  //     }

  //     // Buscar dados históricos anteriores a previsão
  //     const historicalData: { day: Date; total_quantity: string }[] =
  //       await DataSource.query(
  //         `
  //         SELECT
  //             date(s.created_at) AS day,
  //             SUM(s.quantity) AS total_quantity
  //         FROM sales s
  //         JOIN products p ON p.id = s.product_id
  //         JOIN categories c ON c.id = p.category_id
  //         WHERE c.id = $1
  //         AND s.status IN (
  //           'Shipped',
  //           'Shipped - delivered to buyer',
  //           'shipped - picked up'
  //         )
  //         GROUP BY date(s.created_at)
  //         ORDER BY day DESC
  //         LIMIT 30;
  //       `,
  //         [categoryId]
  //       );

  //     if (historicalData.length === 0) {
  //       return response.status(400).json({
  //         message: 'Não há dados históricos suficientes para esta categoria'
  //       });
  //     }

  //     // Formatar dados para o modelo
  //     const formatData = historicalData.map(data => {
  //       return {
  //         ds: data.day.toISOString().split('T')[0]!,
  //         y: data.total_quantity
  //       };
  //     });

  //     const forecastRun = await DataSource.getRepository(ForecastRun).findOne({
  //       where: {
  //         category: { id: categoryId },
  //         company: { id: companyId }
  //       },
  //       order: { createdAt: 'DESC' },
  //       relations: ['forecastData']
  //     });

  //     if (!forecastRun) {
  //       return response.status(400).json({
  //         message:
  //           'Não há previsões geradas para esta categoria. Por favor, gere uma previsão primeiro.'
  //       });
  //     }

  //     // Preparar dados para análise OpenAI
  //     const analysisData = {
  //       categoryName: category.name,
  //       companyName: company.name,
  //       metrics: forecastRun.metrics,
  //       forecasts: forecastRun.forecastData.map(f => ({
  //         date: new Date(f.date),
  //         predicted: f.predicted,
  //         predictedLower: f.predictedLower,
  //         predictedUpper: f.predictedUpper
  //       })),
  //       historicalData: historicalData.map(h => ({
  //         date: h.day,
  //         quantity: parseFloat(h.total_quantity)
  //       }))
  //     };

  //     // Gerar análise com OpenAI
  //     const analysis = await openaiService.analyzeForecast(analysisData);

  //     // Gerar PDF com análise
  //     const pdfBuffer = await pdfService.generateForecastAnalysisReport({
  //       categoryName: category.name,
  //       companyName: company.name,
  //       analysis,
  //       metrics: analysisData.metrics,
  //       forecasts: analysisData.forecasts.map(f => ({
  //         date: new Date(f.date),
  //         predicted: f.predicted,
  //         predictedLower: f.predictedLower,
  //         predictedUpper: f.predictedUpper
  //       })),
  //       createdAt: new Date()
  //     });

  //     // Retornar PDF
  //     response.setHeader('Content-Type', 'application/pdf');
  //     response.setHeader(
  //       'Content-Disposition',
  //       `attachment; filename="analise-forecast-${category.name.replace(
  //         /\s/g,
  //         '-'
  //       )}-${Date.now()}.pdf"`
  //     );
  //     return response.send(pdfBuffer);
  //   } catch (error) {
  //     console.error('Erro ao gerar relatório de análise:', error);
  //     return response.status(500).json({
  //       message: 'Erro ao gerar relatório de análise',
  //       error: error instanceof Error ? error.message : 'Erro desconhecido'
  //     });
  //   }
  // };

  create = async (_: Request, response: Response) => {
    const categories = await this.deps.repositories.categoriesRepository.find();

    const jobs = categories.map(category => {
      return this.deps.repositories.forecastJobsRepository.create({
        category,
        status: ForecastJobStatus.PENDING,
        company: { id: category.companyId }
      });
    });

    await this.deps.repositories.forecastJobsRepository.save(jobs);

    this.deps.services.databaseNotificationService.notify(
      'forecast_jobs',
      'New forecast jobs created'
    );

    response.status(204).send();
  };

  notify = async (request: Request, response: Response) => {
    const notifySchema = z.object({
      message: z.string().optional()
    });

    const { message } = notifySchema.parse(request.body);

    await this.deps.services.databaseNotificationService.notify(
      'forecast_jobs',
      message
    );

    return response.sendStatus(204);
  };
}

export default ForecastController;
