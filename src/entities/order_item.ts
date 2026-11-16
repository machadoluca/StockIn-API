import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('order_items')
class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}

export default OrderItem;
