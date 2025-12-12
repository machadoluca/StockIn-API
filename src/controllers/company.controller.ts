import type { RequestHandler } from 'express';
import type { Repository } from 'typeorm';
import z from 'zod';
import Company from '../domain/entities/company';
import { DataSource } from '../database/connection';
import Category from '../domain/entities/category';
import Product from '../domain/entities/product';
import { pagination } from '../utils/pagination';
import ForecastRun from '../domain/entities/forecastRun';

class CompanyController {
  private companyRepository: Repository<Company>;

  constructor(companyRepository?: Repository<Company>) {
    this.companyRepository =
      companyRepository ?? DataSource.getRepository(Company);
  }

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

    const categories = await DataSource.getRepository(Category).find({
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

    const products = await DataSource.getRepository(Product).find({
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

      const lastForecastData = await DataSource.getRepository(
        ForecastRun
      ).findOne({
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
