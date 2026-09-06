import React, { useEffect, useState } from 'react';
import { fetchUserDeliveries, Delivery } from '../api/controlRoomApi';

interface MyDeliveriesProps {
  currentUserId?: string;
}

export const MyDeliveries: React.FC<MyDeliveriesProps> = ({ currentUserId = 'current-user' }) => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMyDeliveries = async () => {
      try {
        setLoading(true);
        const data = await fetchUserDeliveries(currentUserId);
        setDeliveries(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch personal deliveries');
      } finally {
        setLoading(false);
      }
    };

    loadMyDeliveries();
  }, [currentUserId]);

  if (loading) return <div>Loading your assigned tasks...</div>;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="my-deliveries-container">
      <h2>My Assigned Sprint Deliveries</h2>
      {deliveries.length === 0 ? (
        <p>No sprint tasks currently assigned to you.</p>
      ) : (
        <div className="deliveries-grid">
          {deliveries.map((item) => (
            <div className="delivery-card" key={item.id}>
              <h3>{item.title}</h3>
              <p>Sprint: {item.sprintId}</p>
              <p>Status: <strong className={`status-${item.status}`}>{item.status}</strong></p>
              <small>Updated: {new Date(item.updatedAt).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};