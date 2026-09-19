import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService, orderService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function EventDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState({});
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [slug]);

  const fetchEvent = async () => {
    try {
      const res = await eventService.obtenerPorSlug(slug);
      if (res.success) {
        setEvent(res.data);
        const ttRes = await eventService.listarTicketTypes(res.data.id);
        if (ttRes.success) setTicketTypes(ttRes.data);
      }
    } catch {
      toast.error('Evento no encontrado');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (ttId, delta) => {
    setSelectedItems((prev) => {
      const current = prev[ttId] || 0;
      const newQty = Math.max(0, Math.min(10, current + delta));
      if (newQty === 0) {
        const { [ttId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [ttId]: newQty };
    });
  };

  const totalAmount = ticketTypes.reduce((sum, tt) => {
    return sum + (selectedItems[tt.id] || 0) * tt.price;
  }, 0);

  const totalTickets = Object.values(selectedItems).reduce((sum, qty) => sum + qty, 0);

  const handlePurchase = async () => {
    if (!user) {
      toast.error('Debes iniciar sesión para comprar');
      navigate('/login');
      return;
    }

    if (totalTickets === 0) {
      toast.error('Selecciona al menos una entrada');
      return;
    }

    setPurchasing(true);
    try {
      const items = Object.entries(selectedItems).map(([ticketTypeId, quantity]) => ({
        ticketTypeId,
        quantity,
      }));

      const res = await orderService.crear({ eventId: event.id, items });
      if (res.success) {
        toast.success('¡Compra realizada exitosamente!');
        navigate('/my-tickets');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al realizar la compra');
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  if (!event) {
    return <div className="container page"><div className="empty-state"><h3>Evento no encontrado</h3></div></div>;
  }

  return (
    <div className="container page">
      <div className="event-detail">
        <div className="event-detail-header">
          {event.image && <img src={event.image} alt={event.name} className="event-detail-image" />}
          <div className="event-detail-info">
            <span className={`event-status-badge status-${event.status}`}>{event.status}</span>
            <h1>{event.name}</h1>
            <p className="event-detail-company">Organiza: {event.companyId?.name || 'Empresa'}</p>
            <div className="event-detail-meta">
              <span>📅 {new Date(event.date).toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              {event.time && <span>🕐 {event.time}</span>}
              <span>📍 {event.venue}</span>
              {event.address && <span>🗺️ {event.address}</span>}
            </div>
            {event.description && <p className="event-detail-desc">{event.description}</p>}
            <p className="event-detail-limit">Máximo {event.maxTicketsPerUser} entradas por usuario</p>
          </div>
        </div>

        <div className="ticket-types-section">
          <h2>Tipos de Entrada</h2>
          {ticketTypes.length === 0 ? (
            <div className="empty-state"><p>No hay entradas disponibles para este evento</p></div>
          ) : (
            <div className="ticket-types-grid">
              {ticketTypes.map((tt) => {
                const available = tt.totalQuantity - tt.soldQuantity;
                const isSelected = (selectedItems[tt.id] || 0) > 0;
                return (
                  <div key={tt.id} className={`ticket-type-card ${isSelected ? 'selected' : ''} ${available === 0 ? 'sold-out' : ''}`}>
                    <div className="tt-header">
                      <h3>{tt.name}</h3>
                      <span className="tt-price">S/ {tt.price.toFixed(2)}</span>
                    </div>
                    {tt.description && <p className="tt-description">{tt.description}</p>}
                    <div className="tt-availability">
                      <span className={available === 0 ? 'text-error' : 'text-success'}>
                        {available === 0 ? 'Agotado' : `${available} disponibles`}
                      </span>
                      <span className="tt-sold">{tt.soldQuantity} vendidas</span>
                    </div>
                    {available > 0 && (
                      <div className="tt-selector">
                        <button className="qty-btn" onClick={() => updateQuantity(tt.id, -1)} disabled={!isSelected}>-</button>
                        <span className="qty-value">{selectedItems[tt.id] || 0}</span>
                        <button className="qty-btn" onClick={() => updateQuantity(tt.id, 1)} disabled={(selectedItems[tt.id] || 0) >= available}>+</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {totalTickets > 0 && (
          <div className="purchase-summary">
            <div className="summary-info">
              <span>{totalTickets} entrada{totalTickets > 1 ? 's' : ''}</span>
              <span className="summary-total">S/ {totalAmount.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handlePurchase} disabled={purchasing}>
              {purchasing ? 'Procesando...' : 'Comprar Ahora'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
