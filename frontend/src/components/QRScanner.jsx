import { useState, useRef, useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import toast from 'react-hot-toast';
import { ticketService } from '../services/api';

function QRScanner({ onClose, onResult }) {
  const [manualDni, setManualDni] = useState('');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
      }
    };
  }, []);

  const startScanner = async () => {
    setScanning(true);
    setResult(null);

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          try {
            const data = JSON.parse(decodedText);
            if (data.dni) {
              stopScanner();
              await handleConsume(data.dni);
            }
          } catch {
            toast.error('QR no válido');
          }
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      toast.error('No se pudo acceder a la cámara');
    }
  };

  const stopScanner = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(() => {});
      html5QrCodeRef.current.clear().catch(() => {});
    }
    setScanning(false);
  };

  const handleConsume = async (dni) => {
    setLoading(true);
    try {
      const response = await ticketService.consumir(dni);
      if (response.success) {
        setResult({
          type: 'success',
          data: response.data,
          message: response.message,
        });
        toast.success('Ticket consumido exitosamente');
        if (onResult) onResult(response);
      }
    } catch (error) {
      const data = error.response?.data;
      if (data?.data?.yaConsumido) {
        setResult({
          type: 'warning',
          data: data.data,
          message: data.message,
        });
      } else {
        const message = data?.message || 'Error al consumir ticket';
        setResult({ type: 'error', message });
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    if (manualDni.length !== 8) {
      toast.error('El DNI debe tener 8 dígitos');
      return;
    }
    await handleConsume(manualDni);
  };

  const resetScanner = () => {
    setResult(null);
    setManualDni('');
  };

  return (
    <div className="scanner-overlay" onClick={onClose}>
      <div className="scanner-modal" onClick={(e) => e.stopPropagation()}>
        <div className="scanner-header">
          <h2>Escanear Ticket</h2>
          <button className="scanner-close" onClick={onClose}>X</button>
        </div>

        <div className="scanner-body">
          {!result && !loading && (
            <>
              <div className="scanner-camera">
                <div id="qr-reader" ref={scannerRef}></div>
                {!scanning && (
                  <button className="btn btn-primary btn-block" onClick={startScanner}>
                    Iniciar Cámara
                  </button>
                )}
                {scanning && (
                  <button className="btn btn-secondary btn-block" onClick={stopScanner}>
                    Detener Cámara
                  </button>
                )}
              </div>

              <div className="scanner-divider">
                <span>o ingresa DNI manualmente</span>
              </div>

              <form className="scanner-manual" onSubmit={handleManualSubmit}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="12345678"
                  value={manualDni}
                  onChange={(e) => setManualDni(e.target.value)}
                  maxLength={8}
                  pattern="\d{8}"
                />
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  Verificar
                </button>
              </form>
            </>
          )}

          {loading && (
            <div className="scanner-loading">
              <p>Verificando ticket...</p>
            </div>
          )}

          {result && (
            <div className={`scanner-result scanner-result-${result.type}`}>
              <div className="scanner-result-icon">
                {result.type === 'success' && '✅'}
                {result.type === 'warning' && '⚠️'}
                {result.type === 'error' && '❌'}
              </div>
              <h3>
                {result.type === 'success' && 'ENTRADA VÁLIDA - CONSUMIR'}
                {result.type === 'warning' && 'YA FUE CONSUMIDO'}
                {result.type === 'error' && 'TICKET NO VÁLIDO'}
              </h3>
              <p className="scanner-result-message">{result.message}</p>

              {result.data?.ticket && (
                <div className="scanner-result-info">
                  <div className="scanner-result-row">
                    <span>Nombre:</span>
                    <strong>{result.data.ticket.nombre} {result.data.ticket.apellido}</strong>
                  </div>
                  <div className="scanner-result-row">
                    <span>DNI:</span>
                    <strong>{result.data.ticket.dni}</strong>
                  </div>
                  <div className="scanner-result-row">
                    <span>Facultad:</span>
                    <strong>{result.data.ticket.facultad}</strong>
                  </div>
                  <div className="scanner-result-row">
                    <span>Estado:</span>
                    <strong className={result.type === 'warning' ? 'text-error' : 'text-success'}>
                      {result.type === 'warning' ? 'CONSUMIDO' : 'CONSUMIDO AHORA'}
                    </strong>
                  </div>
                  {result.data.fechaConsumo && (
                    <div className="scanner-result-row">
                      <span>Fecha consumo:</span>
                      <strong>
                        {new Date(result.data.fechaConsumo).toLocaleString('es-AR')}
                      </strong>
                    </div>
                  )}
                </div>
              )}

              <button
                className="btn btn-primary btn-block"
                onClick={resetScanner}
              >
                Escanear Otro
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRScanner;
