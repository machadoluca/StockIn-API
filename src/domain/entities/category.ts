import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import Product from './product.js';

@Entity('categories')
class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}

export default Category;
