import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm';

import Product from './product';
import Company from './company';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  trendType: string;

  @Column({ type: 'float4', nullable: true })
  trendPercentage: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @RelationId((category: Category) => category.company)
  companyId: string;
}

export default Category;
