import {
  useEffect,
  useState,
} from "react";

import {
  fetchDeliveries,
  updateDeliveryStatus,
  type Delivery,
} from "../api/controlRoomApi";

import { DeliveryDetails } from "../components/DeliveryDetails";

function Deliveries() {
  const [
    deliveries,
    setDeliveries,
  ] = useState<Delivery[]>([]);

  const [
    selectedDelivery,
    setSelectedDelivery,
  ] = useState<Delivery | null>(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await fetchDeliveries();

        if (!cancelled) {
          setDeliveries(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load deliveries."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleStatusChange(
    id: string,
    status: Delivery["status"]
  ) {
    try {
      const updated =
        await updateDeliveryStatus(
          id,
          status
        );

      setDeliveries((current) =>
        current.map((item) =>
          item.id === id
            ? updated
            : item
        )
      );

      setSelectedDelivery(updated);
    } catch (err) {
      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to update delivery."
      );
    }
  }

  if (loading) {
    return (
      <div className="loading-spinner">
        Loading deliveries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-banner">
        {error}
      </div>
    );
  }

  return (
    <section className="deliveries-page">
      <h2>Deliveries</h2>

      {deliveries.length === 0 ? (
        <p>
          No deliveries are currently
          available.
        </p>
      ) : (
        <div className="deliveries-table-wrapper">
          <table className="deliveries-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Assignee</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {deliveries.map(
                (delivery) => (
                  <tr
                    key={delivery.id}
                  >
                    <td>
                      {delivery.id}
                    </td>

                    <td>
                      {delivery.title}
                    </td>

                    <td>
                      {delivery.assignee ||
                        "Unassigned"}
                    </td>

                    <td>
                      {delivery.status}
                    </td>

                    <td>
                      <button
                        onClick={() =>
                          setSelectedDelivery(
                            delivery
                          )
                        }
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedDelivery && (
        <DeliveryDetails
          delivery={selectedDelivery}
          onClose={() =>
            setSelectedDelivery(null)
          }
          onStatusChange={
            handleStatusChange
          }
        />
      )}
    </section>
  );
}

export default Deliveries;