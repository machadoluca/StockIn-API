import z from 'zod';
import type { Repository } from 'typeorm';
import type { RequestHandler } from 'express';

import Category from '../entities/category';
import DataSource from '../database/connection';

class CategoryController {
  private categoryRepository: Repository<Category>;

  constructor(categoryRepository?: Repository<Category>) {
    this.categoryRepository =
      categoryRepository ?? DataSource.getRepository(Category);
  }

  public create: RequestHandler = async (request, response) => {
    const categorySchema = z.object({
      name: z.string()
    });

    try {
      categorySchema.parse(request.body);

      const { name }: z.infer<typeof categorySchema> = request.body;

      const createdCategory = await this.categoryRepository.save({
        name
      });

      response.status(200).json(createdCategory);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(401).json(error.issues);
      }
    }
  };

  public getCategoriesByCompanyId: RequestHandler = async (
    request,
    response
  ) => {
    const { companyId } = request.params;

    try {
      if (!companyId) {
        return response.status(401).json({ message: 'companyId not provided' });
      }

      const categories = await this.categoryRepository.find({
        where: {
          company: { id: companyId }
        },
        relations: ['company']
      });

      if (!categories)
        return response.status(401).json({ message: 'categories not found' });

      return response.status(200).json(categories);
    } catch (error) {}
  };

  public getCategory: RequestHandler = async (request, response) => {
    const { categoryId } = request.params;

    try {
      if (!categoryId) {
        return response
          .status(401)
          .json({ message: 'categoryId not provided' });
      }

      const category = await this.categoryRepository.findOneBy({
        id: categoryId
      });

      if (!category)
        return response.status(401).json({ message: 'category not found' });

      return response.status(200).json(category);
    } catch (error) {}
  };
}

export default CategoryController;
