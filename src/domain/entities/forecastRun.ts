import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import Category from './category';
import Forecast from './forecast';
import Company from './company';

@Entity('forecast_runs')
class ForecastRun {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  metrics: any;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @OneToMany(() => Forecast, forecast => forecast.run)
  forecastData: Forecast[];
}

export default ForecastRun;
