# Reflex Sprint — Architecture

## 1. Project Overview

Reflex is a readiness and last-mile delivery operations prototype.

The frontend experience is presented as the **Reflex Control Room**, an operational dashboard designed to help users monitor deliveries, view delivery information, manage rider assignments, track delivery status, and perform delivery-related actions.

The frontend is a separate layer from the backend and database.

### Frontend Stack

* React
* Vite
* TypeScript
* CSS
* Fetch API for backend communication

### Development / Prototype Environment

The frontend prototype is being developed and run using **Replit**.

The GitHub repository remains the source repository for the project.

---

# 2. System Architecture

The project follows a separation-of-responsibilities architecture.

```text
┌─────────────────────────────────────────┐
│           REFLEX CONTROL ROOM           │
│                                         │
│        React + Vite + TypeScript        │
│                                         │
│  Dashboard                              │
│  Deliveries                             │
│  Riders                                 │
│  Delivery Details                       │
│  Delivery Actions                       │
└────────────────────┬────────────────────┘
                     │
                     │ HTTP / REST API
                     ▼
┌─────────────────────────────────────────┐
│              BACKEND API                │
│                                         │
│ Authentication                          │
│ Validation                              │
│ Business Logic                          │
│ API Endpoints                           │
│ Error Handling                          │
│ CORS                                    │
└────────────────────┬────────────────────┘
                     │
                     │ Database Operations
                     ▼
┌─────────────────────────────────────────┐
│                 SUPABASE                │
│                                         │
│ Database                                │
│ Persistent Data                         │
│ Backend Data Operations                 │
└─────────────────────────────────────────┘
```

The frontend is responsible for the user interface and user interaction.

The backend is responsible for business logic, API processing, authentication, validation, and communication with Supabase.

---

# 3. Frontend Architecture

The frontend should use a modular React structure.

```text
Frontend/
├── .env.example
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
│
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    │
    ├── components/
    │   ├── Sidebar.tsx
    │   ├── Topbar.tsx
    │   ├── MetricCard.tsx
    │   ├── DeliveryTable.tsx
    │   ├── StatusBadge.tsx
    │   ├── DeliveryDetails.tsx
    │   └── NewDeliveryModal.tsx
    │
    ├── pages/
    │   ├── Dashboard.tsx
    │   ├── Deliveries.tsx
    │   └── Riders.tsx
    │
    ├── api/
    │   ├── apiClient.ts
    │   ├── deliveriesApi.ts
    │   └── errors.ts
    │
    ├── types/
    │   └── delivery.ts
    │
    └── config/
        └── api.ts
```

This structure should be maintained unless there is a strong technical reason to modify it.

---

# 4. Application Entry

## `main.tsx`

`main.tsx` is responsible for mounting the React application.

It imports:

* React
* `App.tsx`
* Global CSS

## `App.tsx`

`App.tsx` acts as the primary application shell.

It should manage the main frontend navigation between:

* Dashboard
* Deliveries
* Riders

The interface should remain a single operational application rather than a collection of unrelated pages.

---

# 5. Pages

## Dashboard

The Dashboard provides an operational overview.

It should display:

* Total deliveries
* Active deliveries
* Deliveries in transit
* Completed deliveries
* Operational alerts
* Recent delivery activity

The Dashboard should allow a user to understand the current operational situation quickly.

---

## Deliveries

The Deliveries page provides the primary delivery-management interface.

It should include:

* Delivery table
* Search
* Filtering
* Delivery status
* Customer information
* Destination
* Rider information
* Delivery actions

A user should be able to select a delivery and view more detailed information.

---

## Riders

The Riders page provides the frontend interface for rider-related information.

It should support the presentation of:

* Rider information
* Assignment information
* Rider availability where supplied by the backend
* Delivery assignment actions where supported

The frontend should not invent backend rider logic.

---

# 6. Reusable Components

The following components should be reusable throughout the application.

### `Sidebar.tsx`

Provides primary navigation.

### `Topbar.tsx`

Provides application context and top-level actions.

### `MetricCard.tsx`

Displays dashboard metrics.

### `DeliveryTable.tsx`

Displays delivery records in a structured table.

### `StatusBadge.tsx`

Provides consistent visual representation of delivery states.

### `DeliveryDetails.tsx`

Displays detailed information for a selected delivery.

### `NewDeliveryModal.tsx`

Provides the frontend form for creating a delivery.

---

# 7. API Architecture

Frontend API communication should be isolated inside the `api/` directory.

## `apiClient.ts`

Provides the reusable HTTP request layer.

Responsibilities include:

* GET requests
* POST requests
* PATCH requests
* PUT requests
* DELETE requests
* Request headers
* Authentication token headers
* Request timeout handling
* HTTP error handling

Components should not contain duplicated fetch logic.

---

## `deliveriesApi.ts`

Contains delivery-specific API functions.

The frontend workflow is designed around five core operations:

1. Retrieve deliveries
2. Create delivery
3. Assign rider
4. Update delivery status
5. Confirm delivery

The exact API routes must be supplied by the backend team.

Do not invent or hard-code final backend routes without confirmation.

---

## `errors.ts`

Provides consistent frontend handling of API failures.

The UI should convert technical failures into understandable user-facing messages.

---

# 8. TypeScript Types

The frontend should use TypeScript interfaces for delivery data.

Expected types include:

```text
Delivery
DeliveryStatus
DeliveryItem
CreateDeliveryRequest
AssignRiderRequest
UpdateDeliveryStatusRequest
ConfirmDeliveryRequest
ApiErrorResponse
```

The backend team should provide the authoritative request and response contracts before final API integration.

---

# 9. Environment Variables

The frontend should use Vite environment variables.

Example:

```text
VITE_API_BASE_URL=
```

The actual backend URL should be supplied through the Replit environment or deployment configuration.

Sensitive credentials must not be committed to GitHub.

Supabase service-role credentials must never be exposed in the frontend.

---

# 10. Authentication

If the backend requires authentication, the frontend API client should support bearer-token authentication.

Example:

```text
Authorization: Bearer <token>
```

The frontend may send authentication information to the backend.

The backend remains responsible for:

* Authentication validation
* Authorization
* Permission enforcement
* Secure credential handling

---

# 11. CORS

The backend must permit requests from the deployed frontend origin.

CORS configuration belongs to the backend.

The frontend must not attempt to bypass browser CORS restrictions.

---

# 12. Supabase Boundary

Supabase is the project's database layer.

The frontend should **not** directly contain privileged Supabase credentials or service-role keys.

The expected data flow is:

```text
React UI
   ↓
Frontend API Client
   ↓
Backend API
   ↓
Supabase
```

This separation protects the database and keeps business logic in the appropriate layer.

---

# 13. Frontend / Backend Responsibilities

## Frontend / UX responsibility

The frontend contribution includes:

* React interface
* Page structure
* Components
* Visual design
* Responsive design
* Navigation
* Delivery views
* Status presentation
* Forms
* User interactions
* Client-side API integration
* Frontend TypeScript types
* Frontend error presentation

## Backend responsibility

The backend contribution includes:

* API implementation
* Server-side validation
* Business logic
* Authentication
* Authorization
* Supabase integration
* Database operations
* CORS
* Server-side error handling

The frontend documentation must not claim ownership of these backend responsibilities.

---

# 14. Deployment

The Reflex Control Room frontend is being developed and demonstrated through Replit.

The frontend should be buildable using the Vite production build process.

The final deployment URL should be added to this document once the Replit prototype has been deployed.

---

# 15. Architectural Goal

The architecture should allow the frontend and backend to be developed independently.

The frontend should be able to consume the finalized backend API without requiring a complete redesign of the user interface.

The frontend therefore focuses on:

```text
Presentation
      ↓
Interaction
      ↓
API Communication
      ↓
User Feedback
```

while the backend handles:

```text
Authentication
      ↓
Validation
      ↓
Business Logic
      ↓
Database
```

This separation keeps the Reflex Control Room maintainable, testable, and ready for backend integration.
