# Reflex- The Readiness Sprint — Reflex Control Room

> A readiness-focused last-mile delivery operations prototype built during the Reflex Sprint.

## Overview

**Reflex Control Room** is the frontend experience for the Reflex Sprint project.

**Live URL**: 
https://reflex-control-room--codebaddie24.replit.app

The prototype is designed as an operational dashboard that gives users a clear view of delivery activity, rider assignments, delivery statuses, operational alerts, and key delivery actions.

The interface follows the principle:

**See → Understand → Act → Confirm**

The frontend is designed to work with a separate backend API, which is responsible for server-side business logic, authentication, validation, and communication with the project's Supabase database.

---

## Project Status

**Current phase:** Frontend / UX prototype and API-ready implementation

The frontend has been structured using:

* React
* Vite
* TypeScript
* CSS
* Fetch API

The prototype is being developed and demonstrated through **Replit**, while the project source code is maintained in GitHub.

---

## Reflex Control Room

The Control Room provides an operational workspace for monitoring and managing deliveries.

### Core screens

* Dashboard
* Deliveries
* Riders
* Delivery details
* New delivery workflow

### Core delivery actions

The frontend is structured around five key operations:

1. View deliveries
2. Create a delivery
3. Assign a rider
4. Update delivery status
5. Confirm a delivery

The frontend initiates these operations through the API layer. The backend team is responsible for implementing and processing the corresponding API endpoints.

---

## Technology Stack

### Frontend

| Technology | Purpose                                |
| ---------- | -------------------------------------- |
| React      | User interface                         |
| Vite       | Frontend build and development tooling |
| TypeScript | Type-safe frontend development         |
| CSS        | Visual design and responsive styling   |
| Fetch API  | Communication with the backend API     |

### Backend

The backend is developed separately by the backend team.

The backend is responsible for:

* API endpoints
* Server-side validation
* Authentication
* Authorization
* Business logic
* CORS
* Error handling
* Database communication

### Database

**Supabase** is used by the backend as the project's database layer.

The frontend does not directly access privileged Supabase credentials.

---

## Architecture

The intended application flow is:

```text
┌───────────────────────────────────────┐
│          REFLEX CONTROL ROOM          │
│                                       │
│       React + Vite + TypeScript       │
│                                       │
│ Dashboard                             │
│ Deliveries                            │
│ Riders                                │
│ Delivery Details                      │
│ Delivery Actions                      │
└───────────────────┬───────────────────┘
                    │
                    │ HTTP / REST API
                    ▼
┌───────────────────────────────────────┐
│              BACKEND API              │
│                                       │
│ Authentication                        │
│ Validation                            │
│ Business Logic                        │
│ API Endpoints                         │
│ Error Handling                         │
│ CORS                                  │
└───────────────────┬───────────────────┘
                    │
                    │ Database Operations
                    ▼
┌───────────────────────────────────────┐
│                SUPABASE               │
│                                       │
│ Database                              │
│ Persistent Application Data           │
└───────────────────────────────────────┘
```

### Frontend boundary

The frontend is responsible for:

* Presentation
* Navigation
* User interaction
* Responsive layouts
* Forms
* Status presentation
* Client-side validation
* API request initiation
* User-facing loading states
* User-facing error states
* User-facing success feedback

### Backend boundary

The backend is responsible for:

* API implementation
* Authentication
* Authorization
* Server-side validation
* Business logic
* CORS configuration
* Supabase communication
* Database operations

This separation allows the frontend and backend to be developed independently.

---

## Frontend Structure

```text
Frontend/
│
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

---

## Component Responsibilities

### `Sidebar.tsx`

Provides the primary Control Room navigation.

### `Topbar.tsx`

Provides page context, system status, and user context.

### `MetricCard.tsx`

Displays operational metrics on the Dashboard.

### `DeliveryTable.tsx`

Displays delivery records in a structured, scannable format.

### `StatusBadge.tsx`

Provides consistent visual and textual delivery-status indicators.

### `DeliveryDetails.tsx`

Displays detailed information for a selected delivery.

### `NewDeliveryModal.tsx`

Provides the frontend interface for creating a new delivery.

---

## Pages

### Dashboard

The Dashboard provides a high-level operational overview.

It includes:

* Total deliveries
* Active deliveries
* Deliveries in transit
* Completed deliveries
* Operational alerts
* Recent delivery activity

The primary UX question is:

> **What is happening right now?**

---

### Deliveries

The Deliveries screen is the primary operational workspace.

It provides:

* Delivery identification
* Customer information
* Destination
* Rider assignment
* Delivery status
* Search
* Filtering
* Delivery actions

---

### Riders

The Riders screen provides visibility into rider availability and current assignments.

The interface presents backend-provided rider information without implementing backend rider-management logic.

---

## Delivery Statuses

The frontend supports the following delivery states:

```text
REQUESTED
ASSIGNED
IN_TRANSIT
DELIVERED
FAILED
CANCELLED
```

Statuses are represented using both text and visual indicators so that colour is not the sole method of communicating state.

---

## API Layer

API communication is isolated from the React components.

### `apiClient.ts`

Provides the reusable HTTP request layer.

It handles:

* Request configuration
* Headers
* JSON requests
* Authentication token headers
* HTTP responses
* API errors

### `deliveriesApi.ts`

Contains frontend functions corresponding to the delivery operations.

These include:

```text
GET    /deliveries
POST   /deliveries
PATCH  /deliveries/:id/assign
PATCH  /deliveries/:id/status
POST   /deliveries/:id/confirm
```

> **Note:** These routes represent the frontend's expected operations. The backend team should confirm the final endpoint paths before integration.

### `errors.ts`

Converts API failures into frontend-friendly error messages.

---

## TypeScript Data Contracts

The frontend defines TypeScript types for the expected delivery data.

These include:

```text
Delivery
DeliveryStatus
DeliveryItem
Rider
CreateDeliveryRequest
AssignRiderRequest
UpdateDeliveryStatusRequest
ConfirmDeliveryRequest
ApiErrorResponse
```

The backend team should provide the authoritative request and response contracts during integration.

---

## Environment Variables

The frontend uses a Vite environment variable for the backend API.

Example:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The actual backend URL should be configured through the development or deployment environment.

### Security

Do not commit sensitive credentials to GitHub.

In particular:

* Do not expose Supabase service-role keys in the frontend.
* Do not hard-code private backend credentials.
* Do not place secrets inside React components.
* Do not commit a populated `.env` file.

Only non-sensitive configuration should be exposed to the frontend.

---

## Visual Design

The Reflex Control Room uses a refined operational colour system.

### Emerald Green

Used as the primary interface colour for:

* Primary actions
* Active navigation
* Progress
* Positive operational states

### Warm Beige

Used for:

* Page backgrounds
* Supporting surfaces
* Secondary interface areas

### Dark Red

Used selectively for:

* Failed deliveries
* Cancelled deliveries
* Critical alerts
* Destructive actions

The purpose of the colour system is to establish visual hierarchy while keeping the interface professional and approachable.

---

## UX Principles

The frontend follows several core UX principles.

### Clarity

Operational information should be easy to understand at a glance.

### Visual hierarchy

Important information should receive stronger visual emphasis than supporting information.

### Consistency

Components, statuses, buttons, forms, and navigation should behave consistently.

### Feedback

Users should receive clear feedback after important actions.

### Responsiveness

The interface should remain usable across desktop, tablet, and mobile screen sizes.

### Accessibility

The interface aims to support:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Readable typography
* Adequate contrast
* Text-based status indicators
* Responsive layouts

---

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## Replit Development

The Reflex Control Room can be opened and developed in Replit using the existing Vite project structure.

Replit should run the project using the existing npm scripts rather than replacing the React/Vite architecture.

The prototype should remain compatible with the GitHub repository.

---

## Backend Integration

When the backend is ready, the frontend integration should follow this process:

```text
1. Backend team confirms API routes
        ↓
2. Backend team confirms request/response schemas
        ↓
3. Frontend API functions are mapped to those routes
        ↓
4. VITE_API_BASE_URL is configured
        ↓
5. Mock delivery data is replaced with API responses
        ↓
6. Loading, success and error states are tested
        ↓
7. Frontend and backend are tested together
```

The frontend should not need to directly modify the Supabase database.

---

## Prototype Data

The current frontend may use mock data to demonstrate the Control Room experience before the backend API is connected.

Mock data is intended for:

* UI development
* UX demonstration
* Interaction testing
* Layout testing
* Presentation

Once the backend is available, the mock data can be replaced with live API responses.

---

## Project Documentation

Additional project documentation includes:

* `architecture.md` — technical architecture and system boundaries
* `frontend-ux.md` — frontend structure, UX principles, design system, and interaction requirements

These documents should remain synchronized with the actual frontend implementation.

---

## Live Prototype

**Reflex Control Room — Replit**

The final Replit deployment URL should be added here once the new Replit prototype has been deployed.

> Previous prototype hosting should not be treated as the current deployment.

---

## Contribution Scope

This frontend contribution focuses specifically on the **Frontend / UX layer** of the Reflex Sprint project.

The frontend work includes:

* React interface
* Vite configuration
* TypeScript configuration
* CSS design system
* Component architecture
* Page structure
* Navigation
* Delivery interface
* Rider interface
* Forms
* API client structure
* Frontend types
* Loading and error presentation

Backend implementation, Supabase database operations, server-side authentication, and server-side business logic remain separate responsibilities of the backend team.

---

## Project Goal

The goal of Reflex Control Room is to provide a clear, responsive, and operationally focused interface for managing last-mile delivery workflows.

The final experience should allow an operator to:

**See what is happening → Understand what needs attention → Take action → Confirm the outcome.**
