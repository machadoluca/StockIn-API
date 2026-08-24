import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import ForecastJob from './forecast-jobs';

@Entity('forecasts_data')
class ForecastData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ForecastJob, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forecast_run_id' })
  run: ForecastJob;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float4' })
  predicted: number;

  @Column({ type: 'float4', name: 'predicted_lower' })
  predictedLower: number;

  @Column({ type: 'float4', name: 'predicted_upper' })
  predictedUpper: number;
}

export default ForecastData;
