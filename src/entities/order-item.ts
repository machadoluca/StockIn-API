import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import Order from './order';
import Product from './product';

@Entity('order_items')
class OrderItem {
  @PrimaryColumn({ name: 'order_id', type: 'varchar', length: 32 })
  orderId: string;

  @PrimaryColumn({ name: 'order_item_id', type: 'integer' })
  orderItemId: number;

  @Column({ name: 'product_id', type: 'varchar', length: 32 })
  productId: string;

  @Column({ name: 'seller_id', type: 'varchar', length: 32 })
  sellerId: string;

  @Column({ name: 'shipping_limit_date', type: 'timestamp' })
  shippingLimitDate: Date;

  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price: string;

  @Column({ name: 'freight_value', type: 'numeric', precision: 10, scale: 2 })
  freightValue: string;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

export default OrderItem;
