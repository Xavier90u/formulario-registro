import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';

export default function CompanyEditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [event, setEvent] = useState(null);
  const [ticketTypes, setTicketTypes] = useState([]);
  const [showTTForm, setShowTTForm] = useState(false);
  const [ttForm, setTtForm] = useState({ name: '', description: '', price: '', totalQuantity: '' });
  const [formData, setFormData] = useState({ name: '', description: '', date: '', time: '', venue: '', address: '', maxTicketsPerUser: 4 });

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      const [eventRes, ttRes] = await Promise.all([
        eventService.obtenerPorId(id),
        eventService.listarTicketTypes(id),
      ]);
      if (eventRes.success) {
        const e = eventRes.data;
        setEvent(e);
        setFormData({
          name: e.name, description: e.description || '', date: e.date?.split('T')[0] || '',
          time: e.time || '', venue: e.venue, address: e.address || '', maxTicketsPerUser: e.maxTicketsPerUser,
        });
      }
      if (ttRes.success) setTicketTypes(ttRes.data);
    } catch {
      toast.error('Error al cargar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleEventUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await eventService.actualizar(id, formData);
      if (res.success) toast.success('Evento actualizado');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al actualizar');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateTT = async (e) => {
    e.preventDefault();
    try {
      const res = await eventService.crearTicketType(id, {
        name: ttForm.name, description: ttForm.description, price: parseFloat(ttForm.price), totalQuantity: parseInt(ttForm.totalQuantity),
      });
      if (res.success) {
        toast.success('Tipo de entrada creado');
        setShowTTForm(false);
        setTtForm({ name: '', description: '', price: '', totalQuantity: '' });
        fetchData();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear tipo de entrada');
    }
  };

  if (loading) return <div className="company-layout"><Sidebar /><div className="company-content"><div className="page-loading"><div className="spinner" /></div></div></div>;
  if (!event) return <div className="company-layout"><Sidebar /><div className="company-content"><div className="empty-state"><h3>Evento no encontrado</h3></div></div></div>;

  return (
    <div className="company-layout">
      <Sidebar />
      <div className="company-content">
        <h1>Editar: {event.name}</h1>
        <div className="event-edit-sections">
          <section className="edit-section">
            <h2>Información del Evento</h2>
            <form onSubmit={handleEventUpdate}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input type="text" name="name" className="form-input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Fecha</label>
                  <input type="date" name="date" className="form-input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Hora</label>
                  <input type="time" name="time" className="form-input" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Lugar</label>
                <input type="text" name="venue" className="form-input" value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Dirección</label>
                <input type="text" name="address" className="form-input" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
              </div>
              <div className="form-group">
                <label className="form-label">Descripción</label>
                <textarea name="description" className="form-input form-textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar Cambios'}</button>
            </form>
          </section>

          <section className="edit-section">
            <div className="section-header">
              <h2>Tipos de Entrada</h2>
              <button className="btn btn-primary btn-sm" onClick={() => setShowTTForm(!showTTForm)}>
                {showTTForm ? 'Cancelar' : '+ Agregar'}
              </button>
            </div>

            {showTTForm && (
              <form className="tt-form" onSubmit={handleCreateTT}>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nombre *</label>
                    <input type="text" className="form-input" placeholder="Ej: General, VIP" value={ttForm.name} onChange={(e) => setTtForm({ ...ttForm, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Precio (S/) *</label>
                    <input type="number" className="form-input" min={0} step={0.01} value={ttForm.price} onChange={(e) => setTtForm({ ...ttForm, price: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Cantidad *</label>
                    <input type="number" className="form-input" min={1} value={ttForm.totalQuantity} onChange={(e) => setTtForm({ ...ttForm, totalQuantity: e.target.value })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Descripción</label>
                  <input type="text" className="form-input" placeholder="Descripción del tipo de entrada" value={ttForm.description} onChange={(e) => setTtForm({ ...ttForm, description: e.target.value })} />
                </div>
                <button type="submit" className="btn btn-primary btn-sm">Crear Tipo de Entrada</button>
              </form>
            )}

            <div className="table-container">
              <table className="table">
                <thead>
                  <tr><th>Nombre</th><th>Precio</th><th>Total</th><th>Vendidas</th><th>Disponibles</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {ticketTypes.length === 0 ? (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>No hay tipos de entrada configurados</td></tr>
                  ) : ticketTypes.map((tt) => (
                    <tr key={tt.id}>
                      <td><strong>{tt.name}</strong></td>
                      <td>S/ {tt.price.toFixed(2)}</td>
                      <td>{tt.totalQuantity}</td>
                      <td>{tt.soldQuantity}</td>
                      <td className={tt.totalQuantity - tt.soldQuantity === 0 ? 'text-error' : 'text-success'}>{tt.totalQuantity - tt.soldQuantity}</td>
                      <td><span className={`badge badge-${tt.status === 'active' ? 'success' : tt.status === 'sold_out' ? 'error' : 'warning'}`}>{tt.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
