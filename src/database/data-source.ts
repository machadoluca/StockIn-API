import 'reflect-metadata';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  synchronize: false,
  logging: false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/database/migration/*.ts'],
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
