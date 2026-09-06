import {
  useEffect,
  useState,
} from "react";

import {
  fetchDeliveries,
  type Delivery,
} from "../api/controlRoomApi";

function MyDeliveries() {
  const [
    deliveries,
    setDeliveries,
  ] = useState<Delivery[]>([]);

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
              : "Failed to load your deliveries."
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

  if (loading) {
    return (
      <div>
        Loading your deliveries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <section className="my-deliveries-container">
      <h2>My Deliveries</h2>

      {deliveries.length === 0 ? (
        <p>
          No deliveries are currently
          assigned to your account.
        </p>
      ) : (
        <div className="deliveries-grid">
          {deliveries.map((delivery) => (
            <article
              className="delivery-card"
              key={delivery.id}
            >
              <h3>
                {delivery.title}
              </h3>

              <p>
                Status:{" "}
                <strong>
                  {delivery.status}
                </strong>
              </p>

              <small>
                Updated:{" "}
                {new Date(
                  delivery.updatedAt
                ).toLocaleString()}
              </small>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default MyDeliveries;