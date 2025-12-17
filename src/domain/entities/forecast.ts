import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import ForecastRun from './forecastRun';

@Entity('forecasts')
class Forecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ForecastRun, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'forecast_run_id' })
  run: ForecastRun;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'float4' })
  predicted: number;

  @Column({ type: 'float4', name: 'predicted_lower' })
  predictedLower: number;

  @Column({ type: 'float4', name: 'predicted_upper' })
  predictedUpper: number;
}

export default Forecast;
