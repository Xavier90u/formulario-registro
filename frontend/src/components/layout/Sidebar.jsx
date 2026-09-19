import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar() {
  const { user, isSuperAdmin } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Panel de Control</h3>
        <p className="sidebar-subtitle">{user?.nombre}</p>
      </div>
      <nav className="sidebar-nav">
        <Link to="/company" className="sidebar-link">Dashboard</Link>
        <Link to="/company/events" className="sidebar-link">Mis Eventos</Link>
        <Link to="/company/events/new" className="sidebar-link">Crear Evento</Link>
        <Link to="/company/checkin" className="sidebar-link">Validar Entrada</Link>
        {isSuperAdmin && (
          <>
            <div className="sidebar-divider" />
            <Link to="/admin/companies" className="sidebar-link">Gestionar Empresas</Link>
          </>
        )}
      </nav>
    </aside>
  );
}
