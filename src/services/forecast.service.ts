import type { AxiosInstance } from 'axios';
import type Category from '../entities/category';

import DataSource from '../database/connection';

class ForecastService {
  constructor(private readonly httpClient: AxiosInstance) {}

  forecastCategories = async (data: Category[]) => {};

  forecastCategory = async (categoryId: string): Promise<any> => {
    const queryData: {
      category: string;
      day: Date;
      total_quantity: string;
    }[] = await DataSource.query(
      `
        SELECT
            c.name AS category,
            date(s.created_at) AS day,
            SUM(s.quantity) AS total_quantity
        FROM sales s
        JOIN products p ON p.id = s.product_id
        JOIN categories c ON c.id = p.category_id
        WHERE c.id = $1
        AND s.status IN (
          'Shipped',
          'Shipping',
          'Shipped - Picked Up',
          'Shipped - Out for Delivery',
          'Shipped - Delivered to Buyer',
          'Pending - Waiting for Pick Up'
        )
        GROUP BY c.name, date(s.created_at)
        ORDER BY day;
      `,
      [categoryId]
    );

    const formatData = queryData.map(data => {
      return {
        ds: data.day.toISOString().split('T')[0],
        y: data.total_quantity
      };
    });

    return this.httpClient.post('/', {
      trainning_data: formatData,
      initial: '45 days',
      period: '7 days',
      horizon_str: '7 days'
    });
  };
}

export default ForecastService;
