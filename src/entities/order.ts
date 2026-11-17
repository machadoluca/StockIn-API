import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('orders')
class Order {
  @PrimaryColumn({ name: 'order_id', type: 'varchar', length: 32 })
  orderId: string;

  @Column({ name: 'customer_id', type: 'varchar', length: 32 })
  customerId: string;

  @Column({ name: 'order_status', type: 'varchar', length: 20 })
  orderStatus: string;

  @Column({ name: 'order_purchase_timestamp', type: 'timestamp' })
  orderPurchaseTimestamp: Date;

  @Column({ name: 'order_approved_at', type: 'timestamp', nullable: true })
  orderApprovedAt: Date | null;

  @Column({
    name: 'order_delivered_carrier_date',
    type: 'timestamp',
    nullable: true
  })
  orderDeliveredCarrierDate: Date | null;

  @Column({
    name: 'order_delivered_customer_date',
    type: 'timestamp',
    nullable: true
  })
  orderDeliveredCustomerDate: Date | null;

  @Column({ name: 'order_estimated_delivery_date', type: 'timestamp' })
  orderEstimatedDeliveryDate: Date;
}

export default Order;
