import type { RequestHandler } from 'express';
import { Like, Raw, Repository } from 'typeorm';
import { DataSource } from '../database/connection';
import Product from '../entities/product';
import z from 'zod';
import Category from '../entities/category';

class ProductController {
  productRepository: Repository<Product>;

  constructor() {
    this.productRepository = DataSource.getRepository(Product);
  }

  public getProducts: RequestHandler = async (request, response) => {
    const { company } = request.body;

    const products = await this.productRepository.count();

    return response.status(200).json({ productsCount: products });
  };

  public create: RequestHandler = async (request, response) => {
    const productSchema = z.object({
      name: z.string(),
      price: z.number(),
      categoryId: z.string()
    });

    const { name, price, categoryId }: z.infer<typeof productSchema> =
      request.body;

    try {
      productSchema.parse(request.body);

      const category = await DataSource.getRepository(Category).findOneBy({
        id: categoryId
      });

      if (!category) {
        return response
          .status(401)
          .json({ message: 'item category not found' });
      }

      const createdProduct = await this.productRepository.save({
        name,
        price,
        category
      });

      return response.status(201).json({ product: createdProduct });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return response.status(401).json(error.issues);
      }
    }
  };

  public getProduct: RequestHandler = async (request, response) => {
    const { productId } = request.params;

    const product = await this.productRepository
      .createQueryBuilder('p')
      .where(`p.id::text ILIKE :search`, { search: `${productId}%` })
      .getMany();

    if (!product) {
      return response.status(400).json({ message: 'product not found' });
    }

    return response.status(200).json(product);
  };
}

export default ProductController;
