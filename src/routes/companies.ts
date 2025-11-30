import { Router } from 'express';

const companyRouter = Router();

companyRouter.post('/', (req, res) =>
  res.json({ message: 'creating company...' })
);

export { companyRouter };
