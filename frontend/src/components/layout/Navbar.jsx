import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, logout, isCompanyAdmin, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">EventTix</Link>
        <div className="navbar-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Inicio</Link>
          <Link to="/events" className={isActive('/events') ? 'active' : ''}>Eventos</Link>
          {user ? (
            <>
              {(isCompanyAdmin || isSuperAdmin) && (
                <Link to="/company" className={isActive('/company') ? 'active' : ''}>Panel Empresa</Link>
              )}
              <Link to="/my-tickets" className={isActive('/my-tickets') ? 'active' : ''}>Mis Entradas</Link>
              <Link to="/my-orders" className={isActive('/my-orders') ? 'active' : ''}>Mis Compras</Link>
              <div className="navbar-user">
                <span className="navbar-user-name">{user.nombre}</span>
                <button className="btn btn-outline btn-sm" onClick={handleLogout}>Salir</button>
              </div>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
