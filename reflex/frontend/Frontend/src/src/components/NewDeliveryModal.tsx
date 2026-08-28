```tsx
import { FormEvent, useState } from "react";

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
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    onSubmit?.({
      customerName,
      customerPhone,
      address,
      itemName,
      quantity,
    });
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-delivery-title"
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">Delivery management</p>
            <h2 id="new-delivery-title">Create delivery</h2>
            <p>
              Enter the information needed to create a new delivery.
            </p>
          </div>

          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close create delivery form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <label className="form-field">
              <span>Customer name</span>
              <input
                type="text"
                value={customerName}
                onChange={(event) =>
                  setCustomerName(event.target.value)
                }
                placeholder="Enter customer name"
                required
              />
            </label>

            <label className="form-field">
              <span>Phone number</span>
              <input
                type="tel"
                value={customerPhone}
                onChange={(event) =>
                  setCustomerPhone(event.target.value)
                }
                placeholder="Enter phone number"
              />
            </label>

            <label className="form-field form-field-full">
              <span>Delivery address</span>
              <textarea
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value)
                }
                placeholder="Enter delivery address"
                rows={3}
                required
              />
            </label>

            <label className="form-field">
              <span>Item</span>
              <input
                type="text"
                value={itemName}
                onChange={(event) =>
                  setItemName(event.target.value)
                }
                placeholder="Enter item"
                required
              />
            </label>

            <label className="form-field">
              <span>Quantity</span>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(event) =>
                  setQuantity(Number(event.target.value))
                }
                required
              />
            </label>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              Create delivery
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default NewDeliveryModal;
```
