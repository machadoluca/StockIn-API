import axios from 'axios';

export const forecastHttpClient = axios.create({
  baseURL: process.env.FORECAST_SERVICE_URL
});
