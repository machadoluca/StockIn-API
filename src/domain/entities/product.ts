import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import Category from './category.js';

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  sku: string;

  @Column({ type: 'integer', nullable: true })
  name: string;

  @Column({ type: 'float4' })
  price: number;

  @ManyToOne(() => Category, category => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @CreateDateColumn({ type: 'time with time zone', name: 'created_at' })
  createdAt: Date;
}

export default Product;
