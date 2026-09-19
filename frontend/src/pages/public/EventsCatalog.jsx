import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../../services/api';

export default function EventsCatalog() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (params) => {
    try {
      const res = await eventService.listarPublicados(params);
      if (res.success) setEvents(res.data);
    } catch {
      console.error('Error fetching events');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents({ search });
  };

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Eventos Disponibles</h1>
        <form className="search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar eventos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Buscar</button>
        </form>
      </div>

      {events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📅</div>
          <h3>No hay eventos disponibles</h3>
          <p>Próximamente habrá eventos para comprar entradas</p>
        </div>
      ) : (
        <div className="events-grid">
          {events.map((event) => (
            <Link to={`/events/${event.slug}`} key={event.id} className="event-card">
              <div className="event-card-image">
                {event.image ? (
                  <img src={event.image} alt={event.name} />
                ) : (
                  <div className="event-card-placeholder">🎉</div>
                )}
                <span className={`event-status-badge status-${event.status}`}>
                  {event.status}
                </span>
              </div>
              <div className="event-card-body">
                <h3>{event.name}</h3>
                <p className="event-card-company">{event.companyId?.name || 'Empresa'}</p>
                <div className="event-card-meta">
                  <span>📅 {new Date(event.date).toLocaleDateString('es-PE')}</span>
                  <span>📍 {event.venue}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
