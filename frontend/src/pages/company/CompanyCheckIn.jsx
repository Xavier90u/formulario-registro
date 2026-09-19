import { useState } from 'react';
import toast from 'react-hot-toast';
import { ticketService } from '../../services/api';
import Sidebar from '../../components/layout/Sidebar';

export default function CompanyCheckIn() {
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async (e) => {
    e.preventDefault();
    if (!code.trim()) {
      toast.error('Ingresa un código');
      return;
    }

    setLoading(true);
    setResult(null);
    try {
      const res = await ticketService.checkIn(code.trim());
      if (res.success) {
        setResult({ success: true, ticket: res.data, message: res.message || 'Check-in exitoso' });
        toast.success('Check-in exitoso');
        setCode('');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Error al validar entrada';
      setResult({ success: false, message: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-layout">
      <Sidebar />
      <div className="company-content">
        <h1>Validar Entrada</h1>
        <p className="page-subtitle">Ingresa o escanea el código de la entrada para registrar su uso</p>

        <form onSubmit={handleCheckIn} className="checkin-form">
          <div className="form-group">
            <label>Código de Entrada</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Ej: a1b2c3d4-e5f6-..."
              className="form-input"
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Validando...' : 'Validar Entrada'}
          </button>
        </form>

        {result && (
          <div className={`checkin-result ${result.success ? 'success' : 'error'}`}>
            <div className="checkin-result-icon">
              {result.success ? '✅' : '❌'}
            </div>
            <div className="checkin-result-info">
              <h3>{result.success ? 'Entrada Válida' : 'Entrada Inválida'}</h3>
              <p>{result.message}</p>
              {result.success && result.ticket && (
                <div className="checkin-ticket-details">
                  <p><strong>Comprador:</strong> {result.ticket.buyerName}</p>
                  <p><strong>Código:</strong> {result.ticket.code}</p>
                  <p><strong>Estado:</strong> {result.ticket.status === 'used' ? 'Usada' : 'Válida'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
