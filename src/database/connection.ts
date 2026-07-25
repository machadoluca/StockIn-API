import { AppDataSource, AppDevDataSource } from './data-source';

const DataSource =
  process.env.NODE_ENV === 'production' ? AppDataSource : AppDevDataSource;

export default DataSource;
