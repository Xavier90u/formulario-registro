import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const generateTicketPDF = async (ticket) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: [80, 160],
  });

  const width = 80;
  const centerX = width / 2;

  // Fondo
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, width, 160, 'F');

  // Borde dashed
  doc.setDrawColor(99, 102, 241);
  doc.setLineWidth(0.5);
  doc.setLineDashPattern([3, 2], 0);
  doc.roundedRect(4, 4, width - 8, 152, 4, 4, 'S');
  doc.setLineDashPattern([], 0);

  // Línea decorativa superior
  doc.setFillColor(99, 102, 241);
  doc.rect(4, 4, width - 8, 3, 'F');

  // Título
  doc.setTextColor(99, 102, 241);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('ENTRADA DIGITAL', centerX, 18, { align: 'center' });

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(6);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistema de Boletos', centerX, 23, { align: 'center' });

  // QR Code
  try {
    const qrData = JSON.stringify({
      id: ticket.id,
      nombre: ticket.nombre,
      dni: ticket.dni,
    });

    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
    });

    doc.addImage(qrDataUrl, 'PNG', centerX - 20, 28, 40, 40);
  } catch (err) {
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(8);
    doc.text('Error generando QR', centerX, 48, { align: 'center' });
  }

  // Línea separadora
  doc.setDrawColor(71, 85, 105);
  doc.setLineWidth(0.2);
  doc.setLineDashPattern([2, 1], 0);
  doc.line(10, 73, width - 10, 73);
  doc.setLineDashPattern([], 0);

  // Datos del ticket
  const startY = 82;
  const labelX = 10;
  const valueX = 45;

  const drawField = (label, value, y) => {
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.text(label, labelX, y);

    doc.setTextColor(248, 250, 252);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.text(value || '-', valueX, y);
  };

  drawField('NOMBRE', `${ticket.nombre} ${ticket.apellido}`, startY);
  drawField('DNI', ticket.dni, startY + 8);
  drawField('FACULTAD', ticket.facultad, startY + 16);
  drawField('FECHA', new Date(ticket.fechaRegistro).toLocaleDateString('es-AR'), startY + 24);
  drawField('CÓDIGO', ticket.id?.slice(-8).toUpperCase(), startY + 32);

  // Estado
  const statusY = startY + 44;
  if (ticket.consumido) {
    doc.setFillColor(239, 68, 68);
    doc.roundedRect(centerX - 18, statusY - 4, 36, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('CONSUMIDO', centerX, statusY + 1, { align: 'center' });
  } else {
    doc.setFillColor(34, 197, 94);
    doc.roundedRect(centerX - 18, statusY - 4, 36, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text('VÁLIDO', centerX, statusY + 1, { align: 'center' });
  }

  // Footer
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(5);
  doc.text('Válido solo una vez', centerX, 150, { align: 'center' });
  doc.text(`Generado: ${new Date().toLocaleString('es-AR')}`, centerX, 154, { align: 'center' });

  // Descargar
  doc.save(`ticket-${ticket.dni}.pdf`);
};

export default generateTicketPDF;
