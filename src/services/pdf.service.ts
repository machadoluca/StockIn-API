import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

interface ForecastPDFData {
  categoryName: string;
  companyName: string;
  analysis: string;
  metrics: any;
  forecasts: {
    date: Date;
    predicted: number;
    predictedLower: number;
    predictedUpper: number;
  }[];
  createdAt: Date;
}

class PDFService {
  async generateForecastAnalysisReport(data: ForecastPDFData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margins: { top: 50, bottom: 50, left: 50, right: 50 },
          bufferPages: true
        });

        const buffers: Buffer[] = [];
        const stream = new PassThrough();

        stream.on('data', (chunk: Buffer) => buffers.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(buffers)));
        stream.on('error', reject);

        doc.pipe(stream);

        // Header
        doc
          .fontSize(24)
          .fillColor('#2C3E50')
          .text('Relatório de Análise de Previsão', { align: 'center' });

        doc.moveDown();
        doc
          .fontSize(12)
          .fillColor('#7F8C8D')
          .text(
            `Gerado em: ${data.createdAt.toLocaleDateString('pt-BR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}`,
            { align: 'center' }
          );

        doc.moveDown(2);

        // Informações Básicas
        doc
          .fontSize(16)
          .fillColor('#34495E')
          .text('Informações do Forecast', { underline: true });

        doc.moveDown(0.5);
        doc.fontSize(12).fillColor('#2C3E50');
        doc.text(`Empresa: ${data.companyName}`, { continued: false });
        doc.text(`Categoria: ${data.categoryName}`, { continued: false });

        doc.moveDown(1.5);

        // Métricas do Modelo
        if (data.metrics) {
          doc
            .fontSize(16)
            .fillColor('#34495E')
            .text('Métricas do Modelo', { underline: true });

          doc.moveDown(0.5);
          doc.fontSize(11).fillColor('#2C3E50');

          if (data.metrics.mape !== undefined) {
            doc.text(`MAPE: ${(data.metrics.mape * 100).toFixed(2)}%`);
          }
          if (data.metrics.mae !== undefined) {
            doc.text(`MAE: ${data.metrics.mae.toFixed(4)}`);
          }
          if (data.metrics.rmse !== undefined) {
            doc.text(`RMSE: ${data.metrics.rmse.toFixed(4)}`);
          }
          if (data.metrics.coverage !== undefined) {
            doc.text(`Coverage: ${(data.metrics.coverage * 100).toFixed(2)}%`);
          }

          doc.moveDown(1.5);
        }

        // Tabela de Previsões
        doc
          .fontSize(16)
          .fillColor('#34495E')
          .text('Previsões', { underline: true });

        doc.moveDown(0.5);

        // Table header
        const tableTop = doc.y;
        const colWidths = { date: 120, predicted: 120, interval: 200 };
        let yPosition = tableTop;

        // Header background
        doc.rect(50, yPosition, 495, 25).fillAndStroke('#3498DB', '#2C3E50');

        doc.fontSize(10).fillColor('#FFFFFF');
        doc.text('Data', 55, yPosition + 8, { width: colWidths.date });
        doc.text('Previsão', 175, yPosition + 8, {
          width: colWidths.predicted
        });
        doc.text('Intervalo de Confiança', 295, yPosition + 8, {
          width: colWidths.interval
        });

        yPosition += 25;

        // Table rows
        doc.fillColor('#2C3E50');
        data.forecasts.forEach((forecast, index) => {
          if (yPosition > 700) {
            doc.addPage();
            yPosition = 50;
          }

          // Alternate row colors
          if (index % 2 === 0) {
            doc.rect(50, yPosition, 495, 20).fill('#ECF0F1');
          }

          doc.fontSize(9).fillColor('#2C3E50');
          doc.text(
            forecast.date.toLocaleDateString('pt-BR'),
            55,
            yPosition + 5,
            { width: colWidths.date }
          );
          doc.text(forecast.predicted.toFixed(2), 175, yPosition + 5, {
            width: colWidths.predicted
          });
          doc.text(
            `${forecast.predictedLower.toFixed(
              2
            )} - ${forecast.predictedUpper.toFixed(2)}`,
            295,
            yPosition + 5,
            { width: colWidths.interval }
          );

          yPosition += 20;
        });

        doc.moveDown(2);

        // Nova página para análise
        doc.addPage();

        // Análise Textual
        doc
          .fontSize(16)
          .fillColor('#34495E')
          .text('Análise Detalhada', { underline: true });

        doc.moveDown(0.5);

        // Processar e adicionar a análise em blocos para evitar overflow
        const analysisLines = data.analysis.split('\n');
        doc.fontSize(10).fillColor('#2C3E50');

        analysisLines.forEach(line => {
          if (doc.y > 720) {
            doc.addPage();
          }

          if (line.trim().startsWith('**') && line.trim().endsWith('**')) {
            // Headers em negrito
            doc
              .fontSize(12)
              .fillColor('#34495E')
              .text(line.replace(/\*\*/g, ''), { continued: false });
            doc.moveDown(0.3);
          } else if (line.trim().startsWith('#')) {
            // Títulos
            doc
              .fontSize(14)
              .fillColor('#2C3E50')
              .text(line.replace(/^#+\s*/, ''), {
                continued: false,
                underline: true
              });
            doc.moveDown(0.5);
          } else if (line.trim()) {
            doc.fontSize(10).fillColor('#2C3E50').text(line, {
              align: 'justify',
              continued: false
            });
          } else {
            doc.moveDown(0.3);
          }
        });

        // Footer em todas as páginas
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
          doc.switchToPage(i);
          doc
            .fontSize(8)
            .fillColor('#95A5A6')
            .text(
              `Página ${i + 1} de ${range.count}`,
              50,
              doc.page.height - 50,
              { align: 'center' }
            );

          doc.text(
            'StockIn - Sistema de Previsão de Vendas',
            50,
            doc.page.height - 35,
            { align: 'center' }
          );
        }

        doc.end();
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        reject(error);
      }
    });
  }
}

export default new PDFService();
