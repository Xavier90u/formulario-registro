import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import generateTicketPDF from './TicketPDF';

function TicketCard({ ticket }) {
  const handleDownloadPDF = async () => {
    try {
      await generateTicketPDF(ticket);
      toast.success('Ticket PDF descargado correctamente');
    } catch (error) {
      toast.error('Error al descargar el ticket');
    }
  };

  const fecha = new Date(ticket.fechaRegistro).toLocaleDateString('es-AR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="ticket-container">
      <div className="ticket">
        <div className="ticket-header">
          <h2>Entrada Digital</h2>
          <p>Sistema de Boletos</p>
        </div>

        <div className="ticket-qr">
          <QRCodeSVG
            value={JSON.stringify({ id: ticket.id, nombre: ticket.nombre, dni: ticket.dni })}
            size={180}
            level="H"
            includeMargin
          />
        </div>

        <div className="ticket-details">
          <div className="ticket-detail">
            <span className="ticket-detail-label">Nombre</span>
            <span className="ticket-detail-value">
              {ticket.nombre} {ticket.apellido}
            </span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-detail-label">DNI</span>
            <span className="ticket-detail-value">{ticket.dni}</span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-detail-label">Facultad</span>
            <span className="ticket-detail-value">{ticket.facultad}</span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-detail-label">Fecha</span>
            <span className="ticket-detail-value">{fecha}</span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-detail-label">Código</span>
            <span className="ticket-detail-value">
              {ticket.id?.slice(-8).toUpperCase()}
            </span>
          </div>
          <div className="ticket-detail">
            <span className="ticket-detail-label">Estado</span>
            <span className={`badge ${ticket.consumido ? 'badge-error' : 'badge-success'}`}>
              {ticket.consumido ? 'Consumido' : 'Válido'}
            </span>
          </div>
        </div>

        <div className="ticket-actions">
          <button className="btn btn-primary btn-block" onClick={handleDownloadPDF}>
            Descargar Ticket PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketCard;
