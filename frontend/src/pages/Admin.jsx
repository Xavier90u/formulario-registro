import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ticketService } from '../services/api';
import QRScanner from '../components/QRScanner';

function Admin() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showScanner, setShowScanner] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    facultad: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        ticketService.listar(),
        ticketService.estadisticas(),
      ]);

      if (ticketsRes.success) setTickets(ticketsRes.data);
      if (statsRes.success) setStats(statsRes.data);
    } catch (error) {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !filters.search ||
      ticket.nombre.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.apellido.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.dni.includes(filters.search);

    const matchesFacultad =
      !filters.facultad || ticket.facultad === filters.facultad;

    return matchesSearch && matchesFacultad;
  });

  const exportCSV = () => {
    const headers = ['Nombre', 'Apellido', 'DNI', 'Facultad', 'Fecha', 'Estado', 'Fecha Consumo'];
    const rows = filteredTickets.map((t) => [
      t.nombre,
      t.apellido,
      t.dni,
      t.facultad,
      new Date(t.fechaRegistro).toLocaleDateString('es-AR'),
      t.consumido ? 'Consumido' : 'Pendiente',
      t.fechaConsumo ? new Date(t.fechaConsumo).toLocaleString('es-AR') : '',
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast.success('CSV descargado');
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p>Cargando panel de administración...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container">
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <div className="admin-header-actions">
            <button className="btn btn-primary" onClick={() => setShowScanner(true)}>
              Escanear QR
            </button>
            <button className="btn btn-secondary" onClick={exportCSV}>
              Exportar CSV
            </button>
          </div>
        </div>

        {stats && (
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Registros</h3>
              <div className="stat-value">{stats.total}</div>
            </div>
            <div className="stat-card">
              <h3>Consumidos</h3>
              <div className="stat-value stat-consumed">{stats.consumidos}</div>
            </div>
            <div className="stat-card">
              <h3>Pendientes</h3>
              <div className="stat-value stat-pending">{stats.pendientes}</div>
            </div>
            {Object.entries(stats.porFacultad).map(([facultad, count]) => (
              <div className="stat-card" key={facultad}>
                <h3>{facultad}</h3>
                <div className="stat-value">{count}</div>
              </div>
            ))}
          </div>
        )}

        <div className="filters">
          <input
            type="text"
            name="search"
            className="form-input"
            placeholder="Buscar por nombre, apellido o DNI..."
            value={filters.search}
            onChange={handleFilterChange}
          />
          <select
            name="facultad"
            className="form-select"
            value={filters.facultad}
            onChange={handleFilterChange}
          >
            <option value="">Todas las facultades</option>
            <option value="Ingeniería">Ingeniería</option>
            <option value="Medicina">Medicina</option>
            <option value="Derecho">Derecho</option>
            <option value="Economía">Economía</option>
            <option value="Ciencias">Ciencias</option>
            <option value="Humanidades">Humanidades</option>
          </select>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Facultad</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Consumido</th>
              </tr>
            </thead>
            <tbody>
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                    No se encontraron tickets
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td>{ticket.nombre}</td>
                    <td>{ticket.apellido}</td>
                    <td>{ticket.dni}</td>
                    <td>{ticket.facultad}</td>
                    <td>
                      {new Date(ticket.fechaRegistro).toLocaleDateString('es-AR')}
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          ticket.consumido ? 'badge-error' : 'badge-success'
                        }`}
                      >
                        {ticket.consumido ? 'Consumido' : 'Válido'}
                      </span>
                    </td>
                    <td>
                      {ticket.fechaConsumo
                        ? new Date(ticket.fechaConsumo).toLocaleString('es-AR')
                        : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showScanner && (
        <QRScanner
          onClose={() => setShowScanner(false)}
          onResult={() => fetchData()}
        />
      )}
    </div>
  );
}

export default Admin;
