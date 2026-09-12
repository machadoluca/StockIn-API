import type { Request, Response } from 'express';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import Sale from '../entities/sale';

class SaleController {
  constructor(private salesRepository: Repository<Sale>) {}

  getMonthlySales = async (request: Request, response: Response) => {
    const { companyId } = request.user;

    const now = dayjs('2022-06-29 00:00:00');
    const startDate = now.subtract(1, 'month').toDate();

    const { total } = await this.salesRepository
      .createQueryBuilder('sale')
      .select('SUM(sale.amount)', 'total')
      .where('sale.company_id = :companyId', { companyId })
      .andWhere('sale.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate: now.toDate()
      })
      .getRawOne();

    // FIX: Mocked response data for demonstration.
    const responseData = [
      {
        id: 'sales',
        value: total,
        percentage: 12
      },
      {
        id: 'orders',
        value: 1251,
        percentage: 23
      },
      {
        id: 'customers',
        value: 72,
        percentage: 5
      }
    ];

    response.status(200).send(responseData);
  };
}

export default SaleController;
