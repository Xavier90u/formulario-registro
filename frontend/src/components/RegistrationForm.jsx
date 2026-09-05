import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ticketService } from '../services/api';

const facultades = [
  'Ingeniería',
  'Medicina',
  'Derecho',
  'Economía',
  'Ciencias',
  'Humanidades',
];

function RegistrationForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    facultad: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.dni.length !== 8) {
      toast.error('El DNI debe tener 8 dígitos');
      return;
    }

    setLoading(true);
    try {
      const response = await ticketService.crear(formData);
      if (response.success) {
        toast.success('¡Registro exitoso!');
        navigate(`/ticket/${response.data.id}`);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Error al registrar';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label">Nombre</label>
        <input
          type="text"
          name="nombre"
          className="form-input"
          placeholder="Ingresa tu nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
          minLength={2}
        />
      </div>

      <div className="form-group">
        <label className="form-label">Apellido</label>
        <input
          type="text"
          name="apellido"
          className="form-input"
          placeholder="Ingresa tu apellido"
          value={formData.apellido}
          onChange={handleChange}
          required
          minLength={2}
        />
      </div>

      <div className="form-group">
        <label className="form-label">DNI</label>
        <input
          type="text"
          name="dni"
          className="form-input"
          placeholder="12345678"
          value={formData.dni}
          onChange={handleChange}
          required
          maxLength={8}
          pattern="\d{8}"
          title="El DNI debe tener exactamente 8 dígitos"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Facultad</label>
        <select
          name="facultad"
          className="form-select"
          value={formData.facultad}
          onChange={handleChange}
          required
        >
          <option value="">Selecciona tu facultad</option>
          {facultades.map((fac) => (
            <option key={fac} value={fac}>
              {fac}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar Entrada'}
      </button>
    </form>
  );
}

export default RegistrationForm;
