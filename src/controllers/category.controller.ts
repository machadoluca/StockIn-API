import type { RequestHandler } from 'express';
import z from 'zod';
import Category from '../domain/entities/category.js';
import { Repository } from 'typeorm';
import { DataSource } from '../database/connection.js';

class CategoryController {
  categoryRepository: Repository<Category>;

  constructor() {
    this.categoryRepository = DataSource.getRepository(Category);
  }

  public create: RequestHandler = async (request, response) => {
    const categorySchema = z.object({
      name: z.string()
    });

    const { name }: z.infer<typeof categorySchema> = request.body;

    const createdCategory = await this.categoryRepository.save({
      name
    });

    response.status(200).json(createdCategory);
  };

  public getCategory: RequestHandler = async (request, response) => {
    const { categoryId } = request.params;

    try {
      const category = await this.categoryRepository.findOneBy({
        id: categoryId!
      });

      if (!category)
        return response.status(401).json({ message: 'category not found' });

      return response.status(200).json(category);
    } catch (error) {}
  };
}

export default CategoryController;
