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
    const { companyId } = request.user;

    const categories = await this.categoryRepository.find({
      where: {
        company: { id: companyId }
      }
    });

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
