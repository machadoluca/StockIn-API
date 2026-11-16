import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import Company from './company';
import Product from './product';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // @Column({ type: 'float4', nullable: true })
  // amount: number;
  // @Column({ type: 'varchar' })
  // status: string;
  // @CreateDateColumn({ name: 'created_at' })
  // createdAt: Date;
  // @ManyToOne(() => Product)
  // @JoinColumn({ name: 'product_id' })
  // product: Product;
  // @ManyToOne(() => Company)
  // @JoinColumn({ name: 'company_id' })
  // company: Company;
}

export default Order;
