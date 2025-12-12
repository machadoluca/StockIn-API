import { AppDataSource, AppDevDataSource } from './data-source';

export const DataSource =
  process.env.NODE_ENV === 'production' ? AppDataSource : AppDevDataSource;
