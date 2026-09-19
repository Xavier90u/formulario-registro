import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { orderService } from '../../services/api';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await orderService.listarPorUser();
      if (res.success) setOrders(res.data);
    } catch {
      toast.error('Error al cargar compras');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-loading"><div className="spinner" /></div>;

  return (
    <div className="container page">
      <h1>Mis Compras</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h3>No tienes compras</h3>
          <p>Explora los eventos disponibles y realiza tu primera compra</p>
          <Link to="/events" className="btn btn-primary">Ver Eventos</Link>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>N° Orden</th>
                <th>Evento</th>
                <th>Fecha</th>
                <th>Total</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="order-number">{order.orderNumber}</td>
                  <td>{order.eventId?.name || 'Evento'}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString('es-PE')}</td>
                  <td className="order-total">S/ {order.totalAmount.toFixed(2)}</td>
                  <td>
                    <span className={`badge badge-${order.status === 'confirmed' ? 'success' : order.status === 'pending' ? 'warning' : 'error'}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
