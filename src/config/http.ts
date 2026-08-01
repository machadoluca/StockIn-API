import axios from 'axios';

export const forecastHttpConfig = axios.create({
  baseURL: process.env.FORECAST_SERVICE_URL
});
