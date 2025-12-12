import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  cnpj: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @CreateDateColumn({ type: 'time with time zone', name: 'created_at' })
  createdAt: Date;
}

export default Company;
