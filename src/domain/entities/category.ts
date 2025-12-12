import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';

import Product from './product';
import Company from './company';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;
}

export default Category;
