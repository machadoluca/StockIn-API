import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import ForecastJob from './forecast-job';
import Category from './category';

@Entity('forecasts_data')
class ForecastData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float4' })
  predicted: number;

  @Column({ type: 'float4', name: 'predicted_lower' })
  predictedLower: number;

  @Column({ type: 'float4', name: 'predicted_upper' })
  predictedUpper: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  categoryId: Category;

  @ManyToOne(() => ForecastJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forecast_run_id' })
  run: ForecastJob;
}

export default ForecastData;
