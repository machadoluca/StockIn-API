import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('forecasts')
class Forecast {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'time with time zone', name: 'created_at' })
  createdAt: Date;
}

export default Forecast;
