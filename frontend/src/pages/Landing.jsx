import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div className="hero">
      <div className="hero-content">
        <h1>
          Tus <span>entradas digitales</span> en un solo lugar
        </h1>
        <p>
          Registra tu entrada de forma rápida y segura. Recibe tu código QR
          instantáneamente y descárgalo como tu pase de acceso.
        </p>

        <Link to="/register" className="btn btn-primary">
          Registrar mi entrada
        </Link>

        <div className="hero-features">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Registro Rápido</h3>
            <p>Completa el formulario en menos de 1 minuto</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Código QR</h3>
            <p>Recibe tu código QR único e indestructible</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💾</div>
            <h3>Descarga Fácil</h3>
            <p>Guarda tu entrada como imagen en tu dispositivo</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;
