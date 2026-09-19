import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';

export default function CompanyCreateEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', description: '', date: '', time: '', venue: '', address: '', maxTicketsPerUser: 4,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await eventService.crear(formData);
      if (res.success) {
        toast.success('Evento creado exitosamente');
        navigate(`/company/events/${res.data.id}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-layout">
      <Sidebar />
      <div className="company-content">
        <h1>Crear Nuevo Evento</h1>
        <form className="event-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre del Evento *</label>
            <input type="text" name="name" className="form-input" placeholder="Ej: Concierto de Rock" value={formData.name} onChange={handleChange} required minLength={2} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Fecha *</label>
              <input type="date" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Hora</label>
              <input type="time" name="time" className="form-input" value={formData.time} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Lugar *</label>
            <input type="text" name="venue" className="form-input" placeholder="Ej: Estadio Nacional" value={formData.venue} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Dirección</label>
            <input type="text" name="address" className="form-input" placeholder="Dirección completa" value={formData.address} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea name="description" className="form-input form-textarea" rows={4} placeholder="Describe tu evento..." value={formData.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Máximo de entradas por usuario</label>
            <input type="number" name="maxTicketsPerUser" className="form-input" min={1} max={50} value={formData.maxTicketsPerUser} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/company/events')}>Cancelar</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
