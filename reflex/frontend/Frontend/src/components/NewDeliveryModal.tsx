import {
  FormEvent,
  useState,
} from "react";

interface NewDeliveryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: {
    customerName: string;
    customerPhone: string;
    address: string;
    itemName: string;
    quantity: number;
  }) => void;
}

function NewDeliveryModal({
  isOpen,
  onClose,
  onSubmit,
}: NewDeliveryModalProps) {
  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [itemName, setItemName] =
    useState("");

  const [quantity, setQuantity] =
    useState(1);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    onSubmit?.({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      address: address.trim(),
      itemName: itemName.trim(),
      quantity,
    });
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <section
        className="modal delivery-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-delivery-title"
      >
        <div className="modal-header">
          <div>
            <div className="modal-eyebrow">
              <span aria-hidden="true" />
              Create delivery
            </div>

            <h2 id="new-delivery-title">
              New delivery
            </h2>

            <p>
              Add the customer, destination and
              item details to create a delivery.
            </p>
          </div>

          <button
            type="button"
            className="icon-button modal-close"
            onClick={onClose}
            aria-label="Close create delivery form"
          >
            ×
          </button>
        </div>

        <div className="modal-progress" aria-hidden="true">
          <span className="modal-progress-active" />
          <span />
          <span />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <div className="form-section-heading">
              <span className="form-step">
                01
              </span>

              <div>
                <strong>
                  Customer information
                </strong>

                <small>
                  Who should receive this delivery?
                </small>
              </div>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Customer name</span>

                <input
                  type="text"
                  value={customerName}
                  onChange={(event) =>
                    setCustomerName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Amara Wanjiku"
                  autoComplete="name"
                  required
                />
              </label>

              <label className="form-field">
                <span>Phone number</span>

                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(event) =>
                    setCustomerPhone(
                      event.target.value
                    )
                  }
                  placeholder="+254 7XX XXX XXX"
                  autoComplete="tel"
                />
              </label>

              <label className="form-field form-field-full">
                <span>Delivery address</span>

                <textarea
                  value={address}
                  onChange={(event) =>
                    setAddress(
                      event.target.value
                    )
                  }
                  placeholder="Enter the complete delivery address"
                  rows={3}
                  required
                />
              </label>
            </div>
          </div>

          <div className="form-section">
            <div className="form-section-heading">
              <span className="form-step">
                02
              </span>

              <div>
                <strong>Delivery item</strong>

                <small>
                  What is being delivered?
                </small>
              </div>
            </div>

            <div className="form-grid">
              <label className="form-field">
                <span>Item</span>

                <input
                  type="text"
                  value={itemName}
                  onChange={(event) =>
                    setItemName(
                      event.target.value
                    )
                  }
                  placeholder="e.g. Clothing order"
                  required
                />
              </label>

              <label className="form-field">
                <span>Quantity</span>

                <input
                  type="number"
                  min={1}
                  step={1}
                  value={quantity}
                  onChange={(event) => {
                    const nextQuantity =
                      Number(event.target.value);

                    setQuantity(
                      Number.isFinite(
                        nextQuantity
                      ) && nextQuantity >= 1
                        ? Math.floor(
                            nextQuantity
                          )
                        : 1
                    );
                  }}
                  required
                />
              </label>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Create delivery
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NewDeliveryModal;