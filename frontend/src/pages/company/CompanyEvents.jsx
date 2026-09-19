import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';

export default function CompanyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => { fetchEvents(); }, [statusFilter]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.listarPorCompany(statusFilter || undefined);
      if (res.success) setEvents(res.data);
    } catch {
      toast.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventService.cambiarEstado(eventId, newStatus);
      toast.success('Estado actualizado');
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const statusOptions = ['draft', 'published', 'active', 'finished', 'cancelled'];

  return (
    <div className="company-layout">
      <Sidebar />
      <div className="company-content">
        <div className="page-header">
          <h1>Mis Eventos</h1>
          <Link to="/company/events/new" className="btn btn-primary">Crear Evento</Link>
        </div>

        <div className="filters">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Todos los estados</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="page-loading"><div className="spinner" /></div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No hay eventos</h3>
            <p>Crea tu primer evento para comenzar a vender entradas</p>
            <Link to="/company/events/new" className="btn btn-primary">Crear Evento</Link>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha</th>
                  <th>Lugar</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id}>
                    <td><strong>{event.name}</strong></td>
                    <td>{new Date(event.date).toLocaleDateString('es-PE')}</td>
                    <td>{event.venue}</td>
                    <td>
                      <select
                        className={`form-select status-select status-${event.status}`}
                        value={event.status}
                        onChange={(e) => handleStatusChange(event.id, e.target.value)}
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Link to={`/company/events/${event.id}`} className="btn btn-outline btn-sm">Editar</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
