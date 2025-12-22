import 'reflect-metadata';
import express from 'express';
import cors from 'cors';

import { DataSource } from './database/connection';

import { authRouter } from './routes/auth';
import { modelRouter } from './routes/model';
import { productRouter } from './routes/products';
import { companyRouter } from './routes/companies';
import { categoryRouter } from './routes/categories';

import { errorMiddleware } from './middlewares/error.middleware';
import { authMiddleware } from './middlewares/auth.middleware';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRouter);
app.use('/model', modelRouter);
app.use('/products', authMiddleware, productRouter);
app.use('/categories', categoryRouter);
app.use('/companies', companyRouter);

// Error handling middleware
app.use(errorMiddleware);

DataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () =>
      console.log(`HTTP server running on localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));
