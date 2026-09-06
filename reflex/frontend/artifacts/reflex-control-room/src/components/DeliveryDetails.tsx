import React from 'react';
import { Delivery } from '../api/controlRoomApi';

interface DeliveryDetailsProps {
  delivery: Delivery | null;
  onClose: () => void;
  onStatusChange: (id: string, newStatus: Delivery['status']) => void;
}

export const DeliveryDetails: React.FC<DeliveryDetailsProps> = ({
  delivery,
  onClose,
  onStatusChange,
}) => {
  if (!delivery) return null;

  return (
    <div className="delivery-modal-overlay">
      <div className="delivery-modal-content">
        <header className="modal-header">
          <h2>Delivery Details #{delivery.id}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>
        
        <div className="modal-body">
          <p><strong>Title:</strong> {delivery.title}</p>
          <p><strong>Sprint ID:</strong> {delivery.sprintId}</p>
          <p><strong>Assignee:</strong> {delivery.assignee}</p>
          <p><strong>Status:</strong> <span className={`status-badge ${delivery.status}`}>{delivery.status}</span></p>
          <p><strong>Created At:</strong> {new Date(delivery.createdAt).toLocaleString()}</p>
          <p><strong>Last Updated:</strong> {new Date(delivery.updatedAt).toLocaleString()}</p>
          
          {delivery.metrics && (
            <div className="metrics-section">
              <h4>Readiness Metrics</h4>
              <pre>{JSON.stringify(delivery.metrics, null, 2)}</pre>
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <label htmlFor="status-select">Update Status: </label>
          <select
            id="status-select"
            value={delivery.status}
            onChange={(e) => onStatusChange(delivery.id, e.target.value as Delivery['status'])}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
          </select>
        </footer>
      </div>
    </div>
  );
};