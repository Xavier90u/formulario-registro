import RegistrationForm from '../components/RegistrationForm';

function Register() {
  return (
    <div className="register-page">
      <div className="register-card">
        <h2>Registrar Entrada</h2>
        <p className="subtitle">Completa tus datos para generar tu entrada</p>
        <RegistrationForm />
      </div>
    </div>
  );
}

export default Register;
