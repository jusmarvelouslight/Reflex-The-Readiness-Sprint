Testing,Q&A, Security & Defense Preparation(Reflex)
| Test ID | Test Case | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **F1** | **Create delivery (retailer)** | New delivery appears in “Open requests” with status `OPEN`; all required fields saved. | ✓ |
| **F2** | **Assign delivery (dispatcher)** | Delivery assigned to a rider; status changes to `ASSIGNED`; assignment record created. | ✓ |
| **F3** | **Rider sees delivery** | Rider’s dashboard shows only their assigned deliveries; new assignment appears without refresh. | ✓ / ✗ |
| **F4** | **Rider changes status (ASSIGNED → PICKED_UP)** | Status updates to `PICKED_UP`; event logged; retailer/dispatcher views update in real time. | ✓ / ✗ |
| **F5** | **Rider changes status (PICKED_UP → DELIVERED)** | Status updates to `DELIVERED`; event logged; delivery marked complete; proof-of-delivery timestamp recorded. | ✓ / ✗ |
| **F6** | **Dispatcher sees status updates** | Dispatcher dashboard reflects latest status and event timeline for each delivery. | ✓ / ✗ |
| **F7** | **Delivery reaches DELIVERED** | Once `DELIVERED`, no further status changes allowed except viewing; audit trail complete. | ✓ / ✗ |

---

