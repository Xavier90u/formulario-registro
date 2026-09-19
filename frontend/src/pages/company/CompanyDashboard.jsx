import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { eventService } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';

export default function CompanyDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchDashboard(); }, []);

  const fetchDashboard = async () => {
    try {
      const res = await eventService.dashboard();
      if (res.success) setStats(res.data);
    } catch {
      toast.error('Error al cargar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="company-layout"><Sidebar /><div className="company-content"><div className="page-loading"><div className="spinner" /></div></div></div>;

  return (
    <div className="company-layout">
      <Sidebar />
      <div className="company-content">
        <h1>Dashboard</h1>
        {stats && (
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">📅</span>
              <div className="stat-info">
                <h3>Total Eventos</h3>
                <div className="stat-value">{stats.totalEvents}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">✅</span>
              <div className="stat-info">
                <h3>Eventos Activos</h3>
                <div className="stat-value">{stats.activeEvents}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⏰</span>
              <div className="stat-info">
                <h3>Próximos Eventos</h3>
                <div className="stat-value">{stats.upcomingEvents}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🏁</span>
              <div className="stat-info">
                <h3>Finalizados</h3>
                <div className="stat-value">{stats.finishedEvents}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎫</span>
              <div className="stat-info">
                <h3>Entradas Vendidas</h3>
                <div className="stat-value">{stats.totalTicketsSold}</div>
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-icon">💰</span>
              <div className="stat-info">
                <h3>Ingresos Totales</h3>
                <div className="stat-value">S/ {stats.totalRevenue.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
        <div className="company-actions">
          <Link to="/company/events/new" className="btn btn-primary">Crear Nuevo Evento</Link>
          <Link to="/company/events" className="btn btn-outline">Ver Todos los Eventos</Link>
        </div>
      </div>
    </div>
  );
}
