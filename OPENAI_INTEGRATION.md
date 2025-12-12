# Integração OpenAI para Análise de Forecasts

## Visão Geral

Esta integração permite gerar análises textuais detalhadas dos forecasts usando GPT-4 da OpenAI e exportar os resultados em formato PDF.

## Configuração

### 1. Instalar Dependências

As dependências já foram instaladas:

- `openai` - SDK oficial da OpenAI
- `pdfkit` - Geração de PDFs
- `@types/pdfkit` - Tipos TypeScript

### 2. Configurar Chave da API

Adicione sua chave da OpenAI no arquivo `.env`:

```env
OPENAI_API_KEY=sk-proj-your-key-here
```

Para obter a chave:

1. Acesse https://platform.openai.com/api-keys
2. Crie uma nova API key
3. Copie e cole no arquivo `.env`

## Como Usar

### Endpoint: Gerar Relatório de Análise

**POST** `/api/model/analysis/report`

**Body:**

```json
{
  "forecast_run_id": "123"
}
```

**Resposta:**

- Retorna um arquivo PDF com a análise completa
- Content-Type: `application/pdf`
- Nome do arquivo: `analise-forecast-{id}-{timestamp}.pdf`

### Exemplo de Uso (curl)

```bash
curl -X POST http://localhost:3000/api/model/analysis/report \
  -H "Content-Type: application/json" \
  -d '{"forecast_run_id": "123"}' \
  --output analise-forecast.pdf
```

### Exemplo de Uso (JavaScript/Fetch)

```javascript
const response = await fetch(
  'http://localhost:3000/api/model/analysis/report',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      forecast_run_id: '123'
    })
  }
);

const blob = await response.blob();
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'analise-forecast.pdf';
a.click();
```

## Estrutura do PDF Gerado

O PDF contém:

1. **Cabeçalho**

   - Título do relatório
   - Data de geração
   - Informações da empresa e categoria

2. **Métricas do Modelo**

   - MAPE (Mean Absolute Percentage Error)
   - MAE (Mean Absolute Error)
   - RMSE (Root Mean Square Error)
   - Coverage

3. **Tabela de Previsões**

   - Data
   - Valor previsto
   - Intervalo de confiança (mínimo - máximo)

4. **Análise Detalhada (Gerada pela OpenAI)**
   - Resumo Executivo
   - Análise de Tendências
   - Métricas de Qualidade do Modelo
   - Análise de Risco
   - Recomendações Estratégicas
   - Conclusão

## Arquivos Criados

### Services

- **`src/services/openai.service.ts`**

  - Integração com a API da OpenAI
  - Método `analyzeForecast()` - Gera análise completa
  - Método `generateInsights()` - Gera insights curtos
  - Usa GPT-4o para análises de alta qualidade

- **`src/services/pdf.service.ts`**
  - Geração de PDFs profissionais
  - Método `generateForecastAnalysisReport()` - Cria PDF com análise
  - Layout formatado com tabelas e cores
  - Paginação automática

### Controller

- **`src/controllers/forecast.controller.ts`**
  - Novo método `generateAnalysisReport()`
  - Busca forecast run com relações
  - Busca dados históricos para contexto
  - Integra OpenAI + PDF
  - Retorna PDF como resposta HTTP

### Routes

- **`src/routes/model.ts`**
  - Nova rota `POST /analysis/report`

## Custos Estimados

### OpenAI API (GPT-4o)

- Input: $2.50 / 1M tokens
- Output: $10.00 / 1M tokens
- Estimativa por análise: ~$0.05 - $0.15 (dependendo do tamanho dos dados)

### Dicas para Reduzir Custos

1. Use cache quando possível
2. Limite o histórico a 30 dias
3. Ajuste `max_tokens` conforme necessário
4. Considere usar GPT-4o-mini para análises mais simples

## Fluxo de Trabalho Completo

1. **Criar Forecast**

   ```bash
   POST /api/model/predict/category
   Body: { "company_id": "...", "category_id": "..." }
   ```

2. **Obter ID do Forecast Run**

   - A resposta da previsão inclui os forecasts salvos
   - Você precisa do `forecast_run_id` para gerar análise

3. **Gerar Análise em PDF**

   ```bash
   POST /api/model/analysis/report
   Body: { "forecast_run_id": "123" }
   ```

4. **Baixar e Visualizar PDF**
   - O PDF é retornado diretamente na resposta
   - Pode ser salvo ou aberto no navegador

## Tratamento de Erros

### Erros Possíveis

- `404` - Forecast run não encontrado
- `400` - Nenhuma previsão encontrada para o forecast run
- `500` - Erro na API da OpenAI ou geração do PDF

### Logs

Erros são logados no console com detalhes:

```
Erro ao gerar análise com OpenAI: [detalhes]
Erro ao gerar PDF: [detalhes]
```

## Próximos Passos / Melhorias Futuras

- [ ] Adicionar cache de análises para economizar custos
- [ ] Permitir customização do template do PDF
- [ ] Adicionar gráficos ao PDF (usando bibliotecas como Chart.js)
- [ ] Suporte para múltiplos idiomas
- [ ] Envio automático por email
- [ ] Agendamento de relatórios periódicos
- [ ] Comparação entre forecasts diferentes
- [ ] Dashboard web para visualizar análises

## Troubleshooting

### Erro: "OpenAI API key not found"

- Certifique-se de que `OPENAI_API_KEY` está definida no `.env`
- Reinicie o servidor após adicionar a chave

### Erro: "PDF generation failed"

- Verifique se há espaço em disco
- Confirme que os dados do forecast estão válidos

### Análise em branco ou incompleta

- Verifique se o forecast run tem dados válidos
- Verifique se há créditos na conta OpenAI
- Aumente `max_tokens` no openai.service.ts

## Suporte

Para problemas ou dúvidas:

1. Verifique os logs do servidor
2. Confirme que a API key está válida
3. Teste a conexão com a OpenAI manualmente
