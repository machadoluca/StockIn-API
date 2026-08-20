import type { RequestHandler } from 'express';
import { Repository } from 'typeorm';
import z from 'zod';
import Company from '../entities/company';
import dataSource from '../database/connection';
import Category from '../entities/category';
import Product from '../entities/product';
import { pagination } from '../utils/pagination';
import ForecastJob from '../entities/forecast-jobs';
import Sale from '../entities/sale';

class CompanyController {
  private companyRepository: Repository<Company>;

  constructor(companyRepository?: Repository<Company>) {
    this.companyRepository =
      companyRepository ?? dataSource.getRepository(Company);
  }

  public getSummary: RequestHandler = async (request, response) => {
    const { companyId } = request.params;

    try {
      const company = await this.companyRepository.findOneBy({ id: companyId });

      if (!company) {
        return response.status(400).json({ message: 'company not found' });
      }

      // Período atual: junho (01/06 a 30/06)
      const currentEndDate = new Date('2022-06-30');
      const currentStartDate = new Date('2022-06-01');

      // Período anterior: maio (01/05 a 31/05)
      const previousEndDate = new Date('2022-05-31');
      const previousStartDate = new Date('2022-05-01');

      const salesRepository = dataSource.getRepository(Sale);

      const currentSalesResult = await salesRepository
        .createQueryBuilder('sale')
        .select('SUM(sale.amount)', 'total')
        .where('sale.company_id = :companyId', { companyId })
        .andWhere('sale.status IN (:...statuses)', {
          statuses: [
            'Shipped',
            'Shipping',
            'Shipped - Picked Up',
            'Shipped - Out for Delivery',
            'Shipped - Delivered to Buyer',
            'Pending - Waiting for Pick Up'
          ]
        })
        .andWhere('sale.created_at BETWEEN :start AND :end', {
          start: currentStartDate,
          end: currentEndDate
        })
        .getRawOne();

      const previousSalesResult = await salesRepository
        .createQueryBuilder('sale')
        .select('SUM(sale.amount)', 'total')
        .where('sale.company_id = :companyId', { companyId })
        .andWhere('sale.status IN (:...statuses)', {
          statuses: [
            'Shipped',
            'Shipping',
            'Shipped - Picked Up',
            'Shipped - Out for Delivery',
            'Shipped - Delivered to Buyer',
            'Pending - Waiting for Pick Up'
          ]
        })
        .andWhere('sale.created_at BETWEEN :start AND :end', {
          start: previousStartDate,
          end: previousEndDate
        })
        .getRawOne();

      const currentSales = Number(currentSalesResult?.total) || 0;
      const previousSales = Number(previousSalesResult?.total) || 0;

      // Última semana (últimos 7 dias do período atual)
      const weekEndDate = new Date(currentEndDate);
      const weekStartDate = new Date(currentEndDate);
      weekStartDate.setDate(weekStartDate.getDate() - 6);

      const weekSalesCount = await salesRepository
        .createQueryBuilder('sale')
        .where('sale.company_id = :companyId', { companyId })
        .andWhere('sale.status IN (:...statuses)', {
          statuses: [
            'Shipped',
            'Shipping',
            'Shipped - Picked Up',
            'Shipped - Out for Delivery',
            'Shipped - Delivered to Buyer',
            'Pending - Waiting for Pick Up'
          ]
        })
        .andWhere('sale.created_at BETWEEN :start AND :end', {
          start: weekStartDate,
          end: weekEndDate
        })
        .getCount();

      // Calcular a diferença percentual
      const percentageChange =
        previousSales === 0
          ? 100
          : ((currentSales - previousSales) / previousSales) * 100;

      return response.status(200).json({
        company,
        currentSales: currentSales,
        percentageChange: Math.round(percentageChange),
        weekSalesCount
      });
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'internal server error' });
    }
  };

  public create: RequestHandler = async (request, response) => {
    const createCompSchema = z.object({
      name: z.string(),
      address: z.string().optional() //TODO
    });

    try {
      const { name, address }: z.infer<typeof createCompSchema> = request.body;
      const createdCompany = await this.companyRepository.save({
        name,
        address
      });

      return response
        .status(200)
        .json({ message: 'company created', company: createdCompany });
    } catch (error) {
      return response.status(401).json({ message: error });
    }
  };

  public getCategories: RequestHandler = async (request, response) => {
    const { companyId } = request.params;

    const categories = await dataSource.getRepository(Category).find({
      where: {
        company: {
          id: companyId
        }
      }
    });

    return response.status(200).json(categories);
  };

  public getProducts: RequestHandler = async (request, response) => {
    const { companyId } = request.params;
    const { page = 1, limit = 20 } = request.query;

    const skip = pagination(Number(page), Number(limit));

    const products = await dataSource.getRepository(Product).find({
      where: {
        company: {
          id: companyId
        }
      },
      take: Number(limit),
      skip,
      order: {
        createdAt: 'ASC'
      }
    });

    return response.status(200).json(products);
  };

  public getLastForecastUpdate: RequestHandler = async (request, response) => {
    const { companyId } = request.params;

    try {
      const company = await this.companyRepository.findOneBy({ id: companyId });

      if (!company) {
        return response.json(400).json({ message: 'company not found' });
      }

      const lastForecastData = await dataSource
        .getRepository(ForecastJob)
        .findOne({
          where: {
            company
          },
          order: {
            createdAt: 'DESC'
          }
        });

      return response.status(200).json(lastForecastData);
    } catch (error) {
      console.log(error);
      return response.status(500).json({ message: 'internal server error' });
    }
  };
}

export default CompanyController;
