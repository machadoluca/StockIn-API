import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export interface ForecastAnalysisData {
  categoryName: string;
  companyName: string;
  metrics: any;
  forecasts: {
    date: Date;
    predicted: number;
    predictedLower: number;
    predictedUpper: number;
  }[];
  historicalData?: {
    date: Date;
    quantity: number;
  }[];
}

class OpenAIService {
  async analyzeForecast(data: ForecastAnalysisData): Promise<string> {
    try {
      // Preparar os dados para análise
      const forecastSummary = data.forecasts.map(f => ({
        data: f.date.toISOString().split('T')[0],
        previsao: f.predicted.toFixed(2),
        intervalo: `${f.predictedLower.toFixed(2)} - ${f.predictedUpper.toFixed(
          2
        )}`
      }));

      const historicalSummary = data.historicalData
        ? data.historicalData.slice(-30).map(h => ({
            data: h.date.toISOString().split('T')[0],
            quantidade: h.quantity
          }))
        : [];

      const prompt = `
Você é um analista de dados especializado em forecasting e análise de séries temporais para negócios de e-commerce.

Analise os seguintes dados de previsão de vendas:

**Empresa:** ${data.companyName}
**Categoria de Produto:** ${data.categoryName}
**Data da Análise:** ${new Date().toLocaleDateString('pt-BR')}

**Métricas do Modelo:**
${JSON.stringify(data.metrics, null, 2)}

**Previsões para os próximos dias:**
${JSON.stringify(forecastSummary, null, 2)}

${
  historicalSummary.length > 0
    ? `**Histórico dos últimos 30 dias:**\n${JSON.stringify(
        historicalSummary,
        null,
        2
      )}`
    : ''
}

Por favor, forneça uma análise completa e profissional incluindo:

1. **Resumo Executivo**: Um overview geral das previsões e principais insights

2. **Análise de Tendências**: 
   - Identificação de padrões de crescimento ou declínio
   - Sazonalidade detectada
   - Volatilidade das previsões

3. **Métricas de Qualidade do Modelo**:
   - Interpretação das métricas (MAPE, MAE, RMSE, etc.)
   - Confiabilidade das previsões

4. **Análise de Risco**:
   - Intervalos de confiança e o que eles significam
   - Cenários otimista e pessimista
   - Fatores de incerteza

5. **Recomendações Estratégicas**:
   - Ações recomendadas para gestão de estoque
   - Sugestões de planejamento operacional
   - Pontos de atenção

6. **Conclusão**: Síntese dos pontos principais e próximos passos

Forneça a análise em português, de forma clara e profissional, adequada para apresentação à gestão da empresa.
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'Você é um analista de dados especializado em forecasting, análise de séries temporais e business intelligence para e-commerce.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      });

      return (
        completion.choices[0]?.message?.content || 'Análise não disponível'
      );
    } catch (error) {
      console.error('Erro ao gerar análise com OpenAI:', error);
      throw new Error('Falha ao gerar análise textual');
    }
  }

  async generateInsights(data: ForecastAnalysisData): Promise<string[]> {
    try {
      const prompt = `
Baseado nos seguintes dados de previsão de vendas para a categoria "${
        data.categoryName
      }" da empresa "${data.companyName}":

Previsões: ${JSON.stringify(data.forecasts.slice(0, 7))}
Métricas: ${JSON.stringify(data.metrics)}

Gere 5 insights curtos e práticos (máximo 150 caracteres cada) sobre essas previsões.
Formate como um array JSON de strings.
`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 500
      });

      const content = completion.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('Erro ao gerar insights:', error);
      return [
        'Análise de insights temporariamente indisponível',
        'Verifique os dados manualmente',
        'Entre em contato com o suporte técnico'
      ];
    }
  }
}

export default new OpenAIService();
