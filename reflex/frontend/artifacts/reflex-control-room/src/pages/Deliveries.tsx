import React, { useEffect, useState } from 'react';
import { fetchDeliveries, updateDeliveryStatus, Delivery } from '../api/controlRoomApi';
import { DeliveryDetails } from '../components/DeliveryDetails';

export const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadDeliveries = async () => {
    try {
      setLoading(true);
      const data = await fetchDeliveries();
      setDeliveries(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeliveries();
  }, []);

  const handleStatusUpdate = async (id: string, status: Delivery['status']) => {
    try {
      const updated = await updateDeliveryStatus(id, status);
      setDeliveries((prev) => prev.map((d) => (d.id === id ? updated : d)));
      if (selectedDelivery?.id === id) {
        setSelectedDelivery(updated);
      }
    } catch (err: any) {
      alert(`Error updating status: ${err.message}`);
    }
  };

  if (loading) return <div className="loading-spinner">Loading Sprint Deliveries...</div>;
  if (error) return <div className="error-banner">Error: {error}</div>;

  return (
    <div className="deliveries-page">
      <h1>Sprint Deliveries Dashboard</h1>
      <table className="deliveries-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Assignee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.map((delivery) => (
            <tr key={delivery.id}>
              <td>{delivery.id}</td>
              <td>{delivery.title}</td>
              <td>{delivery.assignee}</td>
              <td><span className={`status-badge ${delivery.status}`}>{delivery.status}</span></td>
              <td>
                <button onClick={() => setSelectedDelivery(delivery)}>Inspect</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedDelivery && (
        <DeliveryDetails
          delivery={selectedDelivery}
          onClose={() => setSelectedDelivery(null)}
          onStatusChange={handleStatusUpdate}
        />
      )}
    </div>
  );
};