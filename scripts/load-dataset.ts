import csv from 'csv-parser';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import Product from '../src/entities/product.js';
import { DataSource } from '../src/database/connection.js';
import Sale from '../src/entities/sale.js';
import Category from '../src/entities/category.js';
import Company from '../src/entities/company.js';

async function loadDataset() {
  await DataSource.initialize();
  console.log('database connected');

  const productRepo = DataSource.getRepository(Product);
  const categoryRepo = DataSource.getRepository(Category);
  const saleRepo = DataSource.getRepository(Sale);
  const companyRepo = DataSource.getRepository(Company);

  const company = companyRepo.create({
    id: 'f7ed78e1-7ba7-4b09-97d9-ab5b469dc5e5',
    name: 'Amazon',
    address: 'Seattle, WA'
  });

  await companyRepo.save(company);

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
        const unitPrice = Number(Amount) / Number(Qty);
        product = await productRepo.save({
          sku: SKU,
          price: unitPrice,
          category: category
        });

        productsCache.set(String(SKU), product);
      }

      const sale = saleRepo.create({
        quantity: Qty,
        amount: Number(Amount),
        status: Status,
        createdAt: new Date(date),
        product,
        company
      });

      await saleRepo.save(sale);
    } catch (error) {
      console.error('Erro ao processar linha:', row, error);
    }
  }
  console.log('Dataset load sucessful!');
}

loadDataset();
