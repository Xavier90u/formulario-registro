import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { companyService } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', description: '', adminName: '', adminEmail: '', adminPassword: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchCompanies(); }, []);

  const fetchCompanies = async () => {
    try {
      const res = await companyService.listar();
      if (res.success) setCompanies(res.data);
    } catch {
      toast.error('Error al cargar empresas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await companyService.crear(form);
      if (res.success) {
        toast.success('Empresa creada exitosamente');
        setShowForm(false);
        setForm({ name: '', email: '', phone: '', description: '', adminName: '', adminEmail: '', adminPassword: '' });
        fetchCompanies();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error al crear empresa');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await companyService.cambiarEstado(id, newStatus);
      if (res.success) {
        toast.success(`Empresa ${newStatus === 'active' ? 'activada' : 'desactivada'}`);
        fetchCompanies();
      }
    } catch {
      toast.error('Error al cambiar estado');
    }
  };

  if (loading) return <div className="company-layout"><Sidebar /><div className="company-content"><div className="page-loading"><div className="spinner" /></div></div></div>;

  return (
    <div className="company-layout">
      <Sidebar />
      <div className="company-content">
        <div className="page-header">
          <h1>Gestionar Empresas</h1>
          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancelar' : '+ Nueva Empresa'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>Crear Nueva Empresa</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre de la Empresa</label>
                  <input type="text" className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email de la Empresa</label>
                  <input type="email" className="form-input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Teléfono</label>
                  <input type="text" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Descripción</label>
                  <input type="text" className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <hr style={{ borderColor: 'var(--border)', margin: '20px 0' }} />
              <h3>Datos del Administrador</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Nombre del Admin</label>
                  <input type="text" className="form-input" value={form.adminName} onChange={(e) => setForm({ ...form, adminName: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label>Email del Admin (para login)</label>
                  <input type="email" className="form-input" value={form.adminEmail} onChange={(e) => setForm({ ...form, adminEmail: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Contraseña del Admin</label>
                <input type="password" className="form-input" value={form.adminPassword} onChange={(e) => setForm({ ...form, adminPassword: e.target.value })} required minLength={6} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Creando...' : 'Crear Empresa'}
                </button>
              </div>
            </form>
          </div>
        )}

        {companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <h3>No hay empresas registradas</h3>
            <p>Crea la primera empresa para comenzar</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Empresa</th>
                  <th>Email</th>
                  <th>Teléfono</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td><strong>{company.name}</strong></td>
                    <td>{company.email}</td>
                    <td>{company.phone || '-'}</td>
                    <td>
                      <span className={`badge badge-${company.status === 'active' ? 'success' : 'error'}`}>
                        {company.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`btn btn-sm ${company.status === 'active' ? 'btn-outline' : 'btn-primary'}`}
                        onClick={() => handleToggleStatus(company.id, company.status)}
                      >
                        {company.status === 'active' ? 'Desactivar' : 'Activar'}
                      </button>
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
