import StatusBadge from "./StatusBadge";
import type { DeliveryStatus } from "../types/delivery";

interface DeliveryRow {
id: string;
customerName: string;
address: string;
status: DeliveryStatus;
rider: string;
}

interface DeliveryTableProps {
deliveries: DeliveryRow[];
}

function DeliveryTable({ deliveries }: DeliveryTableProps) {
if (deliveries.length === 0) {
return ( <div className="empty-state"> <div className="empty-icon">⌕</div> <strong>No deliveries found</strong> <p>
Try adjusting your search or status filter. </p> </div>
);
}

return ( <div className="table-wrapper"> <table className="delivery-table"> <thead> <tr> <th>Delivery</th> <th>Customer</th> <th>Destination</th> <th>Rider</th> <th>Status</th> <th> <span className="sr-only">Actions</span> </th> </tr> </thead>

```
    <tbody>
      {deliveries.map((delivery) => (
        <tr key={delivery.id}>
          <td>
            <span className="delivery-id">
              {delivery.id}
            </span>
          </td>

          <td>
            <div className="customer-cell">
              <strong>{delivery.customerName}</strong>
              <span>Customer</span>
            </div>
          </td>

          <td>
            <div className="destination-cell">
              <span className="destination-pin">⌖</span>
              {delivery.address}
            </div>
          </td>

          <td>
            <span className="rider-name">
              {delivery.rider}
            </span>
          </td>

          <td>
            <StatusBadge status={delivery.status} />
          </td>

          <td>
            <button
              type="button"
              className="table-action"
              aria-label={`View ${delivery.id}`}
            >
              View
              <span>→</span>
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
```

);
}

export default DeliveryTable;

```
```
