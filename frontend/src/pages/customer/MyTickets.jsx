import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ticketService } from '../../services/api';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(null);

  useEffect(() => { fetchTickets(); }, []);

  const fetchTickets = async () => {
    try {
      const res = await ticketService.listarPorUser();
      if (res.success) setTickets(res.data);
    } catch {
      toast.error('Error al cargar entradas');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (code) => {
    setDownloading(code);
    try {
      await ticketService.descargarPdf(code);
      toast.success('PDF descargado');
    } catch {
      toast.error('Error al descargar PDF');
    } finally {
      setDownloading(null);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="container page">
      <h1>Mis Entradas</h1>
      {tickets.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🎫</div>
          <h3>No tienes entradas</h3>
          <p>Explora los eventos disponibles y compra tu primera entrada</p>
          <Link to="/events" className="btn btn-primary">Ver Eventos</Link>
        </div>
      ) : (
        <div className="tickets-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-item">
              <div className="ticket-item-info">
                <h3>{ticket.eventId?.name || 'Evento'}</h3>
                <p>{ticket.buyerName}</p>
                <p className="ticket-item-date">{new Date(ticket.createdAt).toLocaleDateString('es-PE')}</p>
              </div>
              <div className="ticket-item-actions">
                <span className={`badge badge-${ticket.status === 'active' ? 'success' : ticket.status === 'used' ? 'warning' : 'error'}`}>
                  {ticket.status === 'active' ? 'Válida' : ticket.status === 'used' ? 'Usada' : 'Cancelada'}
                </span>
                <span className="ticket-code">{ticket.code.slice(0, 8)}</span>
                {ticket.status === 'active' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleDownload(ticket.code)}
                    disabled={downloading === ticket.code}
                  >
                    {downloading === ticket.code ? 'Descargando...' : 'Descargar PDF'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
