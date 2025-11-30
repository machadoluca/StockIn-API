import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('companies')
class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  address: string;
}

export default Company;
