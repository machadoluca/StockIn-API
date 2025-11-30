import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import Product from './product.js';

@Entity('sales')
class Sale {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'varchar' })
  status: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}

export default Sale;
