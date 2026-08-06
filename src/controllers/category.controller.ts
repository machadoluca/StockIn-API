import type { Request, Response } from 'express';
import type { Repository } from 'typeorm';
import z from 'zod';

import Category from '../entities/category';
import AppError from '../utils/error';

class CategoryController {
  constructor(private readonly categoryRepository: Repository<Category>) {}

  create = async (request: Request, response: Response) => {
    const categorySchema = z.object({
      companyId: z.string(),
      name: z.string()
    });

    const { name, companyId } = categorySchema.parse(request.body);

    const createdCategory = await this.categoryRepository.save({
      name,
      company: { id: companyId }
    });

    response.status(200).json(createdCategory);
  };

  getCategories = async (request: Request, response: Response) => {
    const categoriesSchema = z.object({
      limit: z.coerce.number().optional(),
      random: z.coerce.boolean().optional()
    });

    const { companyId } = request.user;
    const { limit, random } = categoriesSchema.parse(request.query);

    let categories: Category[] = [];
    if (random) {
      categories = await this.categoryRepository
        .createQueryBuilder('category')
        .where('category.company_id = :companyId', { companyId })
        .orderBy('RANDOM()')
        .take(limit)
        .getMany();
    } else {
      categories = await this.categoryRepository.find({
        where: {
          company: { id: companyId }
        },
        take: limit
      });
    }

    if (!categories.length) throw new AppError('Categories not found', 404);

    return response.status(200).json(categories);
  };

  getCategory = async (request: Request, response: Response) => {
    const { categoryId } = request.params;

    const category = await this.categoryRepository.findOneBy({
      id: categoryId
    });

    if (!category) throw new AppError('Category not found', 404);

    return response.status(200).json(category);
  };
}

export default CategoryController;
