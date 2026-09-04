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
3. Security
**Goal:** Show you’ve thought about auth, authorization, and data protection.

### 3.1 Authentication & Password Handling
* **Auth mechanism:** e.g., email/password via Node + JWT.
* **Password hashing:** Passwords never stored in plaintext;
* **Session management:** Tokens expire; refresh strategy defined; logout invalidates tokens.

#### Tests:
* **S1:** Attempt login with wrong password → login fails, no info leakage about whether email exists.
* **S2:** Inspect stored passwords in DB → confirm only hashes stored.
* **S3:** Use an expired JWT on an API → server returns 401; client redirects to login.

### 3.2 Role-Based Authorization
* **Roles:** Retailer, Dispatcher, Rider.
* Each role has a defined permission matrix (who can create, assign, update, view).

#### Tests:
* **S4:** Rider calls `POST /assignments` (dispatcher-only) → 403 Forbidden.
* **S5:** Retailer tries to view another retailer’s deliveries → filtered by `retailerId`; others not visible.
* **S6:** Rider tries to update a delivery not assigned to them → 403.

### 3.3 API Authorization & Input Validation
All endpoints validate:
1. User is authenticated.
2. User has the right role.
3. Input matches schema (e.g., phone format, required fields, allowed status values).

#### Tests:
* **S7:** Send malformed payload (e.g., missing `customerPhone`) to create delivery → 400 with validation error.
* **S8:** Send invalid status transition (e.g., OPEN → DELIVERED) → 400/409, no state change.
* **S9:** Tamper with JWT role claim (if possible) → server rejects or signature verification fails.

### 3.4 Access Control & Data Protection
* **Row-level security:**
  * Retailers only see their own deliveries.
  * Riders only see their own assignments.
* Sensitive fields (customer phone, address) not exposed to users who don’t need them.

#### Tests:
* **S10:** Rider API response inspected → only their assignments returned; no other riders’ data.
* **S11:** Dispatcher views delivery list → customer phone/address visible (as needed); but riders from other retailers not visible if multi-retailer.
* **S12:** Direct object reference test: Rider changes `deliveryId` in request to another delivery ID → server checks ownership and rejects if not theirs.

### 3.5 Basic Hardening Checklist
* HTTPS enforced in production.
* CORS configured to allow only your frontend origin.
* Rate limiting on auth and critical endpoints (optional but good to mention).
* No secrets (DB passwords, JWT secrets) in frontend code or public repo.

---
4. Trade-Off Log
Maintain this as a one-pager you can hand to the panel.

| # | Trade-off | Weakness | Why we accepted it | Impact | What we’d do differently |
|---|---|---|---|---|---|
| T1 | Manual rider assignment (dispatcher picks rider by hand) | Doesn’t scale; relies on human judgment; no auto load-balancing. | Fastest to implement; lets us validate core flow before adding optimization. | Dispatcher bottleneck; possible uneven workload across riders. | Add auto-assignment based on proximity, load, and availability; introduce rules engine. |
| T2 | Online-first rather than fully offline | Riders with spotty connectivity may experience failed updates or delays. | Full offline sync (queues, conflict resolution) is complex; we prioritized core online flow. | Occasional failed status updates in poor-network areas; UX friction. | Implement local queue + retry logic; conflict resolution strategy; clearer offline indicators. |
| T3 | PostgreSQL as primary source of truth (instead of Firebase/Mongo) | More ops overhead; need to manage DB, migrations, connections. | Team familiarity; strong relational model fits deliveries/assignments; better for complex queries later. | Slower to set up; more moving parts than a managed NoDB. | Add connection pooling, read replicas, and monitoring; consider managed Postgres (e.g., RDS/Neon). |
| T4 | Basic proof of delivery (timestamp + status) rather than full photo/signature | Easier to dispute; less robust evidence in case of fraud. | Photo/signature infrastructure adds storage, UI, and privacy complexity. | Higher risk of “they say they delivered, customer says no” disputes. | Add optional photo upload + GPS + signature capture; store securely with access controls. |

---
5. Cross-Examination Preparation (Question Bank)
Use **State → Context → Evidence** for each answer.

### Architecture

#### Q: Why PostgreSQL?
* **State:** We chose PostgreSQL as our source of truth because our data is highly relational and we need strong consistency.
* **Context:** Deliveries, assignments, and events have clear relationships and constraints; SQL gives us schema enforcement and powerful queries.
* **Evidence:** Our schema enforces foreign keys between deliveries, assignments, and events, preventing orphaned records.

#### Q: Why Node.js?
* **State:** Node.js lets us share language and patterns between frontend and backend.
* **Context:** The team is strongest in JavaScript/TypeScript; this reduces context switching and speeds iteration.
* **Evidence:** Our API and frontend both use TypeScript, sharing types for requests/responses.

---
Trade-offs

#### Q: What’s the weakest part of your design?
* **State:** Our weakest part is the online-first assumption with limited offline support.
* **Context:** Riders in areas with poor connectivity may struggle to update status reliably.
* **Evidence:** In our network-drop test, status updates failed until reconnection; we show an error but don’t yet queue writes.

#### Q: What did you deliberately leave out?
* **State:** We deliberately left out photo/signature proof of delivery.
* **Context:** That adds storage, privacy, and UI complexity we didn’t need for the core flow.
* **Evidence:** Our `delivery_events` table stores only timestamp and optional GPS, not images.

#### Q: What won’t scale?
* **State:** Manual assignment by a single dispatcher won’t scale to many retailers and riders.
* **Context:** As volume grows, a human can’t optimally assign every delivery.
* **Evidence:** In our test with 50 open deliveries, assignment time increased noticeably.

#### Q: What would you change with more time?
* **State:** With more time, we’d add offline-first sync with a local queue and conflict resolution.
* **Context:** That would make the app robust in low-connectivity environments.
* **Evidence:** We prototyped a local queue idea but didn’t implement conflict merging yet.

---
 Edge Cases

#### Q: What happens when the network goes down?
* **State:** In-flight requests fail; the UI shows an error and the user can retry.
* **Context:** We’re currently online-first; we don’t persist mutations locally yet.
* **Evidence:** In our airplane-mode test, the status update failed and showed “Network error – try again”.

#### Q: What if two dispatchers assign simultaneously?
* **State:** Only one assignment succeeds; the other fails.
* **Context:** We use a DB transaction and status check to ensure a delivery is assigned once.
* **Evidence:** In our test, one dispatcher got success, the other got a 409 “Delivery already assigned”.

#### Q: What if a rider changes the wrong delivery?
* **State:** They can’t, because we enforce ownership at the API level.
* **Context:** Each status update checks that the delivery is assigned to that rider.
* **Evidence:** When Rider A tried to update Rider B’s delivery, the API returned 403.

#### Q: What if the database goes down?
* **State:** The app becomes unavailable; we don’t have a replica yet.
* **Context:** This is a known limitation of our current setup.
* **Evidence:** In our test where we stopped the DB container, all API calls returned 500.

#### Q: What if the rider doesn’t update the delivery?
* **State:** The delivery stays in its last known status; the retailer sees it as stuck.
* **Context:** We don’t yet have automatic timeouts or escalation rules.
* **Evidence:** In our test, an un-updated delivery remained “ASSIGNED” indefinitely.

---

