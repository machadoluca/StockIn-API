import type { AxiosInstance } from 'axios';

class ForecastService {
  constructor(private readonly httpClient: AxiosInstance) {}

  forecast = async (data: { ds: Date; y: string }[]) => {
    const formatData = data.map(data => {
      return {
        ds: data.ds.toISOString().split('T')[0],
        y: data.y
      };
    });

    return formatData;
    // FEAT: Chamar serviço de previsão
    // const modelReponse = await this.httpClient.post('/', {
    //   trainning_data: formatData,
    //   initial: '45 days',
    //   period: '7 days',
    //   horizon_str: '7 days'
    // });
  };
}

export default ForecastService;
