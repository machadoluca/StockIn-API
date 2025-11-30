import csv from 'csv-parser';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import Product from '../src/domain/entities/product.js';
import { DataSource } from '../src/database/connection.js';
import Sale from '../src/domain/entities/sale.js';
import Category from '../src/domain/entities/category.js';

async function loadDataset() {
  await DataSource.initialize();
  console.log('database connected');

  const productRepo = DataSource.getRepository(Product);
  const categoryRepo = DataSource.getRepository(Category);
  const saleRepo = DataSource.getRepository(Sale);

  const filePath = path.join(
    fileURLToPath(import.meta.url),
    '../../dataset/',
    'Amazon_Sale_Report.csv'
  );

  const productsCache = new Map<string, Product>();
  const categoriesCache = new Map<string, Category>();

  const stream = fs.createReadStream(filePath).pipe(csv());

  for await (const row of stream) {
    try {
      const { Date: date, Category, SKU, Status, Amount, Qty } = row;

      let category = categoriesCache.get(Category);

      if (!category) {
        category = await categoryRepo.save({
          name: Category
        });

        categoriesCache.set(String(Category), category);
      }

      let product = productsCache.get(SKU);

      if (!product) {
        product = await productRepo.save({
          sku: SKU,
          price: Number(Amount),
          category: category
        });

        productsCache.set(String(SKU), product);
      }

      const sale = saleRepo.create({
        quantity: Qty,
        status: Status,
        createdAt: new Date(date),
        product
      });

      await saleRepo.save(sale);
    } catch (error) {
      console.error('Erro ao processar linha:', row, error);
    }
  }
  console.log('Dataset load sucessful!');
}

loadDataset();
