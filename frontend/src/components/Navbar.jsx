import { Link } from 'react-router-dom';

function Navbar() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="container">
        <Link to="/" className="navbar-brand">
          EntradasDigitales
        </Link>
        <div className="navbar-links">
          <Link to="/">Inicio</Link>
          <Link to="/register">Registrar</Link>
          {token ? (
            <>
              <Link to="/admin">Admin</Link>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Admin
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
