import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ticketService } from '../services/api';
import TicketCard from '../components/TicketCard';

function TicketView() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await ticketService.obtenerPorId(id);
        if (response.success) {
          setTicket(response.data);
        }
      } catch (err) {
        setError('Ticket no encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  if (loading) {
    return (
      <div className="ticket-container">
        <p>Cargando ticket...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ticket-container">
        <p style={{ color: 'var(--error)' }}>{error}</p>
      </div>
    );
  }

  return <TicketCard ticket={ticket} />;
}

export default TicketView;
