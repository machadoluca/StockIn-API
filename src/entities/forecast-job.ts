import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm';
import { ForecastJobStatus } from '../types/forecast-job-status';

import Category from './category';
import ForecastData from './forecast-data';
import Company from './company';
import type { IForecastData } from '../services/forecast.service';

@Entity('forecast_jobs')
class ForecastJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  metrics: IForecastData['data']['metrics'];

  @Index()
  @Column({
    type: 'enum',
    enum: ForecastJobStatus,
    default: ForecastJobStatus.PENDING
  })
  status: ForecastJobStatus;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @Column({
    type: 'timestamp with time zone',
    name: 'finished_at',
    default: null
  })
  finishedAt: Date;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'reference_timestamp'
  })
  referrenceTimestamp: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => ForecastData, forecast => forecast.run)
  forecastData: ForecastData[];

  @RelationId((forecastJob: ForecastJob) => forecastJob.category)
  categoryId: string;

  @RelationId((forecastJob: ForecastJob) => forecastJob.company)
  companyId: string;
}

export default ForecastJob;
