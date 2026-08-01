import 'reflect-metadata';
import { DataSource } from 'typeorm';

import Category from '../entities/category';
import Company from '../entities/company';
import Product from '../entities/product';
import Forecast from '../entities/forecast';
import ForecastRun from '../entities/forecastRun';
import Sale from '../entities/sale';
import User from '../entities/user';
import Prompt from '../entities/prompt';
import Report from '../entities/report';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  synchronize: false,
  logging: false,
  entities: [
    Category,
    Company,
    Product,
    Forecast,
    ForecastRun,
    Sale,
    User,
    Prompt,
    Report
  ],
  migrations: ['dist/database/migration/*.js'],
  subscribers: []
});

export const AppDevDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  synchronize: true,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/database/migration/*.ts'],
  subscribers: []
});
