import type { AxiosInstance, AxiosResponse } from 'axios';

export interface IForecastData extends AxiosResponse {
  data: {
    forecast: {
      ds: Date;
      yhat: number;
      yhat_lower: number;
      yhat_upper: number;
    }[];
    metrics: {
      coverage: number;
      horizon: string;
      mae: number;
      mdape: number;
      mse: number;
      rmse: number;
      smape: number;
    };
  };
}

class ForecastService {
  constructor(private readonly httpClient: AxiosInstance) {}

  forecast = async (
    data: { ds: Date; y: string }[]
  ): Promise<IForecastData> => {
    const formatData = data.map(data => {
      return {
        ds: data.ds.toISOString().split('T')[0],
        y: data.y
      };
    });

    const response = await this.httpClient.post('/forecast', {
      trainning_data: formatData,
      initial: '45 days',
      period: '7 days',
      horizon_str: '7 days'
    });

    return response;
  };
}

export default ForecastService;
