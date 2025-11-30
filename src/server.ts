import 'reflect-metadata';
import express from 'express';
import { DataSource } from './database/connection.js';
import { modelRouter } from './routes/model.js';
import { productRouter } from './routes/products.js';
import { companyRouter } from './routes/companies.js';
import { categoryRouter } from './routes/categories.js';

const app = express();

app.use(express.json());

app.use('/model', modelRouter);
app.use('/products', productRouter);
app.use('/categories', categoryRouter);
app.use('/companies', companyRouter);

DataSource.initialize()
  .then(() => {
    console.log('Database connected');
    app.listen(process.env.PORT, () =>
      console.log(`HTTP server running on localhost:${process.env.PORT}`)
    );
  })
  .catch(err => console.log(err));
