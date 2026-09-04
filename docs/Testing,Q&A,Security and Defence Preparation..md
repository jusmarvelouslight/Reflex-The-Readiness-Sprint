Testing,Q&A, Security & Defense Preparation(Reflex)
1. Functional testing
Goal: Prove the core flow works end-to-end for all three roles.

| Test ID | Test Case | Expected Result | Status |
| :--- | :--- | :--- | :---: |
| **F1** | **Create delivery (retailer)** | New delivery appears in “Open requests” with status `OPEN`; all required fields saved. | ✓ |
| **F2** | **Assign delivery (dispatcher)** | Delivery assigned to a rider; status changes to `ASSIGNED`; assignment record created. | ✓ |
| **F3** | **Rider sees delivery** | Rider’s dashboard shows only their assigned deliveries; new assignment appears without refresh. | ✓ / ✗ |
| **F4** | **Rider changes status (ASSIGNED → PICKED_UP)** | Status updates to `PICKED_UP`; event logged; retailer/dispatcher views update in real time. | ✓ / ✗ |
| **F5** | **Rider changes status (PICKED_UP → DELIVERED)** | Status updates to `DELIVERED`; event logged; delivery marked complete; proof-of-delivery timestamp recorded. | ✓ / ✗ |
| **F6** | **Dispatcher sees status updates** | Dispatcher dashboard reflects latest status and event timeline for each delivery. | ✓  |
| **F7** | **Delivery reaches DELIVERED** | Once `DELIVERED`, no further status changes allowed except viewing; audit trail complete. | ✓ |

---
2. Edge-Case Testing
**Goal:** Stress the system where real-world failures happen.

| # | Case | Steps | Expected result | Status |
|---|---|---|---|---|
| E1 | Two dispatchers assign the same delivery | Dispatcher A and B open the same OPEN delivery; both click “Assign” at nearly the same time (to different riders). | Only one assignment succeeds; the other fails with a clear error; delivery has exactly one rider. | ✓ / ✗ |
| E2 | Two riders attempt to update the same delivery | Rider A and B both assigned (incorrectly) to same delivery; both try to mark PICKED_UP. | Only the legitimate rider’s update succeeds; other is rejected with authorization error. | ✓ / ✗ |
| E3 | Rider tries invalid transition: DELIVERED → PICKED_UP | Rider opens a DELIVERED delivery and attempts to set status back to PICKED_UP. | Request rejected; status remains DELIVERED; error shown to user. | ✓ / ✗ |
| E4 | Unauthorised user accesses another role’s functionality | Logged-in rider tries to call dispatcher-only API (e.g., assign delivery) or view all open requests. | Access denied (403); no data returned; action not performed. | ✓ / ✗ |
| E5 | Network disappears during a status update | Rider toggles airplane mode after pressing “Picked Up” but before request completes. | On reconnect, client either (a) completes the update once or (b) shows failure and allows retry; no duplicate events created. | ✓ / ✗ |
| E6 | User refreshes the page | During any flow (create, assign, update), user refreshes browser. | No data loss; in-flight operations either complete or fail cleanly; UI reflects server state after reload. | ✓ / ✗ |
| E7 | Delivery doesn’t have a rider | Dispatcher tries to mark a delivery as PICKED_UP or DELIVERED without assigning a rider. | Action blocked; system requires assignment first; status cannot skip ASSIGNED. | ✓ / ✗ |
| E8 | Required customer information is missing | Retailer tries to create delivery with missing phone or address. | Form validation blocks submit; clear error messages; no incomplete records created. | ✓ / ✗ |

---

