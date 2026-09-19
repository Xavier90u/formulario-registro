import PDFDocument from 'pdfkit';
import QRCode from 'qrcode';
import { PdfPort, TicketPdfData } from '../../../ports/output/PdfPort';

export class PdfService implements PdfPort {
  async generarTicketPdf(data: TicketPdfData): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      try {
        const pageWidth = 400;
        const pageHeight = 700;
        const margin = 20;

        const doc = new PDFDocument({
          size: [pageWidth, pageHeight],
          margin: 0,
          autoFirstPage: false,
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        doc.addPage({ size: [pageWidth, pageHeight], margin: 0 });

        const darkBg = '#0f1729';
        const purpleAccent = '#6c3ce0';
        const lightText = '#ffffff';
        const mutedText = '#a0aec0';
        const greenBadge = '#38d979';
        const dashedColor = '#5a3fc4';

        doc.rect(0, 0, pageWidth, pageHeight).fill(darkBg);

        doc.roundedRect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, 12)
          .lineWidth(2)
          .dash(8, { space: 4 })
          .stroke(dashedColor)
          .undash();

        doc.fontSize(22).font('Helvetica-Bold').fillColor(lightText)
          .text('ENTRADA DIGITAL', margin, margin + 30, { width: pageWidth - margin * 2, align: 'center' });

        doc.fontSize(10).font('Helvetica').fillColor(mutedText)
          .text('Sistema de Boleteria', margin, margin + 58, { width: pageWidth - margin * 2, align: 'center' });

        const qrSize = 180;
        const qrX = (pageWidth - qrSize) / 2;
        const qrY = margin + 80;

        const qrBuffer = await QRCode.toBuffer(data.ticket.code, {
          width: qrSize,
          margin: 0,
          color: { dark: '#000000', light: '#ffffff' },
        });

        doc.roundedRect(qrX - 8, qrY - 8, qrSize + 16, qrSize + 16, 8)
          .fill('#ffffff');

        doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });

        const sepY = qrY + qrSize + 30;
        doc.moveTo(margin + 30, sepY).lineTo(pageWidth - margin - 30, sepY)
          .lineWidth(0.5)
          .stroke(purpleAccent);

        const fieldsY = sepY + 25;
        const labelX = margin + 35;
        const valueX = pageWidth / 2 + 10;
        const lineSpacing = 32;

        const fields = [
          { label: 'NOMBRE', value: data.ticket.buyerName },
          { label: 'DNI', value: data.ticket.buyerDni || '-' },
          { label: 'TIPO', value: data.ticketTypeName },
          { label: 'EVENTO', value: data.eventName },
          { label: 'FECHA', value: new Date(data.eventDate).toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' }) },
          { label: 'HORA', value: data.eventTime || '-' },
          { label: 'LUGAR', value: data.eventVenue },
          { label: 'CÓDIGO', value: data.ticket.code.slice(0, 12) },
        ];

        for (let i = 0; i < fields.length; i++) {
          const y = fieldsY + i * lineSpacing;
          doc.fontSize(8).font('Helvetica').fillColor(mutedText)
            .text(fields[i].label, labelX, y, { width: 80 });
          doc.fontSize(10).font('Helvetica-Bold').fillColor(lightText)
            .text(fields[i].value, valueX, y, { width: pageWidth - valueX - margin - 35 });
        }

        const badgeY = fieldsY + fields.length * lineSpacing + 20;
        const badgeText = data.ticket.status === 'active' ? 'VÁLIDO' :
                          data.ticket.status === 'used' ? 'USADO' : 'CANCELADO';
        const badgeColor = data.ticket.status === 'active' ? greenBadge :
                           data.ticket.status === 'used' ? '#f59e0b' : '#ef4444';
        const badgeWidth = 120;
        const badgeHeight = 32;
        const badgeX = (pageWidth - badgeWidth) / 2;

        doc.roundedRect(badgeX, badgeY, badgeWidth, badgeHeight, 16)
          .fill(badgeColor);

        doc.fontSize(12).font('Helvetica-Bold').fillColor(darkBg)
          .text(badgeText, badgeX, badgeY + 9, { width: badgeWidth, align: 'center' });

        const footerY = pageHeight - margin - 45;
        doc.fontSize(8).font('Helvetica').fillColor(mutedText)
          .text('Válido sólo una vez', margin, footerY, { width: pageWidth - margin * 2, align: 'center' });

        const genDate = new Date().toLocaleDateString('es-PE', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
        });
        doc.fontSize(7).font('Helvetica').fillColor(mutedText)
          .text(`Generado: ${genDate}`, margin, footerY + 14, { width: pageWidth - margin * 2, align: 'center' });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
