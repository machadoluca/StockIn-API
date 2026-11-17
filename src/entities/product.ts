import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
class Product {
  @PrimaryColumn({ name: 'product_id', type: 'varchar', length: 32 })
  productId: string;

  @Column({
    name: 'product_category_name',
    type: 'varchar',
    length: 60,
    nullable: true
  })
  productCategoryName: string | null;

  @Column({ name: 'product_name_lenght', type: 'integer', nullable: true })
  productNameLength: number | null;

  @Column({
    name: 'product_description_lenght',
    type: 'integer',
    nullable: true
  })
  productDescriptionLength: number | null;

  @Column({ name: 'product_photos_qty', type: 'integer', nullable: true })
  productPhotosQty: number | null;

  @Column({ name: 'product_weight_g', type: 'integer', nullable: true })
  productWeightG: number | null;

  @Column({ name: 'product_length_cm', type: 'integer', nullable: true })
  productLengthCm: number | null;

  @Column({ name: 'product_height_cm', type: 'integer', nullable: true })
  productHeightCm: number | null;

  @Column({ name: 'product_width_cm', type: 'integer', nullable: true })
  productWidthCm: number | null;
}

export default Product;
