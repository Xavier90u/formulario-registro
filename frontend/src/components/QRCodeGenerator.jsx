import { QRCodeSVG } from 'qrcode.react';

function QRCodeGenerator({ data, size = 200 }) {
  const qrData = JSON.stringify({
    id: data.id,
    nombre: data.nombre,
    dni: data.dni,
  });

  return (
    <div className="ticket-qr">
      <QRCodeSVG value={qrData} size={size} level="H" includeMargin />
    </div>
  );
}

export default QRCodeGenerator;
