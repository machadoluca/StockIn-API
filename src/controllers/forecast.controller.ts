import type { RequestHandler } from 'express';
import { DataSource } from '../database/connection.js';

class ForecastController {
  public predict: RequestHandler = async (request, response) => {
    const data = await DataSource.query(`
      SELECT 
          c.name AS category,
          date_trunc('month', s.created_at) AS month,
          SUM(s.quantity) AS total_quantity
      FROM sales s
      JOIN products p ON p.id = s.product_id
      JOIN categories c ON c.id = p.category_id
      WHERE s.status IN (
        'Shipped',
        'Shipped - delivered to buyer',
        'shipped - picked up'
      )
      GROUP BY 1, 2
      ORDER BY 1, 2;  
    `);

    return response.status(200).json(data);
  };
}

export default ForecastController;
