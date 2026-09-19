import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Gestiona y vende <span>entradas</span> de forma profesional
        </h1>
        <p>
          La plataforma multiempresa para la gestión y venta de entradas digitales.
          Crea eventos, configura tipos de entrada y vende de forma segura.
        </p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary">Ver Eventos</Link>
          <Link to="/register" className="btn btn-outline">Crear Cuenta</Link>
        </div>
        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Entradas Digitales</h3>
            <p>Códigos QR únicos para cada entrada</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🏢</div>
            <h3>Multiempresa</h3>
            <p>Cada empresa gestiona sus eventos de forma independiente</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard Completo</h3>
            <p>Estadísticas de ventas y asistencia en tiempo real</p>
          </div>
        </div>
      </div>
    </div>
  );
}
