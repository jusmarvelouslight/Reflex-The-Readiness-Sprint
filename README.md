Reflex — The Readiness Sprint

Reflex is a last-mile delivery coordination prototype designed to replace fragmented WhatsApp-group-and-phone-call workflows with one shared operational system for retailers, dispatchers, and riders.

The project is split into a React/Vite/TypeScript frontend and a Node/Express backend. The frontend is responsible for the Control Room experience and UX, while the backend owns authentication, validation, business logic, API endpoints, and database operations.

Live Deployments

- Reflex Control Room ( Frontend ) — Render: https://reflex-control-room01.onrender.com/
- Reflex Backend — Render: https://reflex-backend-ru4q.onrender.com

«The Replit deployment is the primary visual and UX reference for the Control Room. The Render deployment is the hosted frontend being aligned with the approved Replit experience.»

---

Table of Contents

- "Project Status" (#project-status)
- "How It Works" (#how-it-works)
- "Tech Stack" (#tech-stack)
- "Architecture" (#architecture)
- "Repository Structure" (#repository-structure)
- "Frontend and UX" (#frontend-and-ux)
- "Getting Started" (#getting-started)
  - "Backend Setup" (#backend-setup)
  - "Frontend Setup" (#frontend-setup)
- "Roles and Permissions" (#roles-and-permissions)
- "Delivery Status Lifecycle" (#delivery-status-lifecycle)
- "API Reference" (#api-reference)
- "Deployment" (#deployment)
- "Known Gaps and Integration Notes" (#known-gaps-and-integration-notes)
- "Testing" (#testing)
- "Roadmap" (#roadmap)

---

Project Status

Current phase: Frontend / UX implementation, deployment integration, and backend integration.

The Reflex Control Room frontend has been developed using:

- React 19
- Vite 7
- TypeScript
- CSS
- Fetch API
- Socket.IO Client

The frontend is maintained in GitHub and demonstrated through Replit and Render deployments.

The current deployment work includes aligning the Render-hosted application with the approved Replit Control Room layout, including the correct Vite configuration, frontend entry files, CSS, components, assets, and project structure.

---

How It Works

Retailer creates a delivery
        ↓
Dispatcher assigns a rider
        ↓
Rider picks up the delivery
        ↓
Rider updates delivery progress
        ↓
Delivery is completed / confirmed

The Control Room is designed around the operational loop:

See → Understand → Act → Confirm

The frontend provides the interface for:

1. Viewing deliveries
2. Creating deliveries
3. Assigning riders
4. Updating delivery status
5. Reviewing delivery details
6. Confirming delivery outcomes

The backend remains the source of truth for authentication, authorization, validation, business rules, status transitions, and persistent data.

---

Tech Stack

Frontend — Reflex Control Room

Technology| Purpose
React 19| User interface
Vite 7| Development server and production build
TypeScript| Type-safe frontend development
CSS| Visual design, layout, and responsiveness
Fetch API| Backend API communication
Socket.IO Client| Real-time integration support

Backend

Technology| Purpose
Node.js + Express 5| REST API
TypeScript| Type safety
Prisma 7| ORM
PostgreSQL / Supabase| Database
jsonwebtoken| Authentication tokens
bcryptjs| Password hashing
zod| Request validation
helmet| HTTP security
cors| Cross-origin configuration

Data Flow

React Control Room
        ↓
Frontend API / Real-time Client
        ↓
Backend REST API
        ↓
Authentication + Validation + Business Logic
        ↓
Prisma
        ↓
PostgreSQL / Supabase

The frontend does not directly access privileged database credentials.

---

Architecture

Frontend Boundary

The frontend is responsible for:

- Presentation
- Navigation
- Responsive layouts
- Forms
- User interaction
- Delivery tables
- Delivery details
- Status presentation
- Client-side validation
- API request initiation
- Loading states
- Error states
- Success feedback
- Real-time UI integration

Backend Boundary

The backend is responsible for:

- Authentication
- Authorization
- Server-side validation
- Business rules
- Delivery status transitions
- API endpoints
- Database operations
- CORS
- Persistent application data

This separation allows the frontend and backend teams to develop independently while sharing defined API contracts.

---

Repository Structure

Reflex-The-Readiness-Sprint/
│
├── docs/
│   └── Testing, Q&A, Security and Defence Preparation.md
│
└── reflex/
    │
    ├── backend/
    │   ├── prisma/
    │   │   ├── schema.prisma
    │   │   └── migrations/
    │   │
    │   ├── src/
    │   │   ├── app.ts
    │   │   ├── server.ts
    │   │   ├── config/
    │   │   ├── controller/
    │   │   ├── services/
    │   │   ├── routes/
    │   │   ├── middleware/
    │   │   ├── schemas/
    │   │   └── utils/
    │   │
    │   └── test.http
    │
    └── frontend/
        │
        ├── README.md
        │
        ├── docs/
        │   ├── architecture.md
        │   └── frontend-ux.md
        │
        └── Frontend/
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
                ├── api/
                │   ├── apiClient.ts
                │   ├── deliveriesApi.ts
                │   └── errors.ts
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
                ├── config/
                │   └── api.ts
                │
                └── types/
                    └── delivery.ts

«The current Vite application is located at "reflex/frontend/Frontend". Any future migration of these files directly into "reflex/frontend" must also update the Render build configuration and other references to the frontend root.»

---

Frontend and UX

Reflex Control Room is an operational dashboard designed to make delivery activity understandable at a glance and important actions easy to execute.

Core Screens

- Dashboard
- Deliveries
- Riders
- Delivery Details
- New Delivery Workflow

Dashboard

The Dashboard provides a high-level operational overview.

It is designed to surface:

- Total deliveries
- Active deliveries
- Deliveries in transit
- Completed deliveries
- Operational alerts
- Recent delivery activity

The primary UX question is:

«What is happening right now?»

Deliveries

The Deliveries screen is the main operational workspace.

It provides:

- Delivery identification
- Customer information
- Destination
- Rider assignment
- Delivery status
- Search
- Filtering
- Delivery actions

Riders

The Riders screen provides visibility into rider availability and assignments.

The frontend displays backend-provided rider information without taking ownership of backend rider-management logic.

UX Principles

Clarity

Operational information should be understandable at a glance.

Visual Hierarchy

Important information should receive stronger visual emphasis than supporting information.

Consistency

Components, buttons, navigation, statuses, and forms should behave consistently.

Feedback

Users should receive clear feedback after important actions.

Responsiveness

The interface should remain usable across desktop, tablet, and mobile screen sizes.

Accessibility

The interface aims to support:

- Semantic HTML
- Keyboard navigation
- Visible focus states
- Readable typography
- Adequate contrast
- Text-based status indicators
- Responsive layouts

---

Getting Started

Backend Setup

Navigate to the backend:

cd reflex/backend

Install dependencies:

npm install

Create:

reflex/backend/.env

Add:

DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=<long-random-secret>
PORT=5000
FRONTEND_URL=https://reflex-control-room01.onrender.com

Run database migrations:

npx prisma migrate deploy

Start the development server:

npm run dev

The backend runs on:

https://reflex-backend-ru4q.onrender.com

Health check:

GET /api/v1/health

Frontend Setup

Navigate to the Vite application:

cd reflex/frontend/Frontend

Install dependencies:

npm install

Create:

.env

Add:

VITE_API_BASE_URL=https://reflex-backend-ru4q.onrender.com/api/v1

VITE_API_URL=https://reflex-backend-ru4q.onrender.com

Start the development server:

npm run dev

Create a production build:

npm run build

Preview the production build:

npm run preview

«Vite environment variables must use the "VITE_" prefix.»

«Do not commit a populated ".env" file or expose private backend, database, or service-role credentials in frontend code.»

---

Roles and Permissions

Every user has one application role.

Role| Responsibilities
"RETAILER"| Create deliveries and view their own deliveries
"DISPATCHER"| View deliveries and assign riders
"RIDER"| View assigned deliveries and update delivery status

Authorization is enforced at the backend layer through role-based middleware and service-level ownership checks.

---

Delivery Status Lifecycle

The authoritative backend lifecycle is:

PENDING
   ↓
ASSIGNED
   ↓
PICKED_UP
   ↓
DELIVERED

Cancellation is available from the appropriate active states:

             ┌──→ CANCELLED
             │
PENDING → ASSIGNED → PICKED_UP → DELIVERED
                         │
                         └──────→ CANCELLED

The backend validates status transitions.

Terminal states include:

DELIVERED
CANCELLED

The frontend may use presentation labels such as:

- "REQUESTED"
- "ASSIGNED"
- "IN_TRANSIT"
- "DELIVERED"
- "FAILED"
- "CANCELLED"

Where frontend labels differ from backend enum values, the two must be explicitly mapped during integration.

---

API Reference

Base API path:

/api/v1

Authentication

Register

POST /auth/register

Example:

{
  "name": "Peter Rider",
  "email": "rider@reflex.test",
  "phone": "0733333333",
  "password": "password123",
  "role": "RIDER"
}

Login

POST /auth/login

Example:

{
  "email": "rider@reflex.test",
  "password": "password123"
}

Current User

GET /auth/me

Authenticated requests use:

Authorization: Bearer <token>

Deliveries

Method| Route| Role| Purpose
"POST"| "/deliveries"| Retailer| Create delivery
"GET"| "/deliveries"| Authenticated users| List role-scoped deliveries
"GET"| "/deliveries/:id"| Authenticated users| View delivery details
"PATCH"| "/deliveries/:id/assign"| Dispatcher| Assign rider
"PATCH"| "/deliveries/:id/status"| Assigned rider| Update delivery status

Create Delivery

POST /deliveries

Example:

{
  "customerName": "John Doe",
  "customerPhone": "0722222222",
  "deliveryAddress": "Kilimani, Nairobi",
  "itemDescription": "Document Package Box"
}

Assign Rider

PATCH /deliveries/:id/assign

Example:

{
  "riderId": "<uuid-of-rider>"
}

Update Delivery Status

PATCH /deliveries/:id/status

Example:

{
  "status": "PICKED_UP"
}

Confirmation

The frontend contains a confirmation workflow:

POST /deliveries/:id/confirm

The backend must expose and document the matching endpoint before this operation is considered fully integrated.

Runnable API examples are available in:

reflex/backend/test.http

---

Deployment

Render

The Render deployment must use the actual Vite frontend application and its production build.

For the current repository structure:

cd reflex/frontend/Frontend
npm install
npm run build

The production build generates the Vite "dist" directory.

The Render configuration should point to the correct frontend root and serve the resulting production build.


Known Gaps and Integration Notes

Frontend Directory Structure

The active Vite application currently exists under:

reflex/frontend/Frontend

Any migration to:

reflex/frontend

must move the complete Vite application together and update:

- Render configuration
- Build commands
- Start commands
- Vite configuration
- TypeScript configuration
- Documentation
- Environment-variable references

API Response Shapes

The frontend and backend must use the same request and response contracts.

The frontend should not assume that every endpoint returns a raw array or object if the backend wraps responses in a standard response envelope.

Confirmation Endpoint

The frontend contains a delivery confirmation operation, but the backend must provide the corresponding endpoint and contract before the feature is considered fully integrated.

Real-Time Synchronization

Socket.IO client support exists in the frontend stack.

Complete real-time functionality requires the backend to provide the corresponding websocket/event implementation and event contract.

Rider Assignment

Rider assignment remains dispatcher-controlled.

Automatic load balancing or rider optimization is not currently part of the core workflow.

Reassignment

The current delivery lifecycle does not provide a complete reassignment workflow after a delivery has already been assigned.

---

Testing

Frontend Build

From the frontend application directory:

cd reflex/frontend/Frontend
npm run lint
npm run build

The production build should complete successfully before deployment.

Backend API Testing

Manual API requests are available in:

reflex/backend/test.http

These can be executed using a REST Client extension such as the VS Code REST Client extension.

Functional Documentation

Functional testing and defence/preparation material is available in:

docs/Testing, Q&A, Security and Defence Preparation.md

Deployment Verification

After deployment, verify:

1. The Render URL loads the React/Vite application.
2. No Vite "Blocked request" or host configuration error appears.
3. The Render layout matches the approved frontend + UX design theme. 
4. CSS loads correctly.
5. Static assets load correctly.
6. Client-side navigation works.
7. Dashboard and delivery screens render correctly.
8. The configured API base URL points to the intended backend.
9. Authenticated API calls use the expected authorization headers.
10. Production builds complete successfully.

---

Roadmap

The next development priorities are:

1. Complete Render Parity

Ensure the Render deployment completely reflects the exact frontend interface, layout and entire app structure.

2. Complete API Contract Integration

Align frontend request and response handling with the backend's authoritative API schemas.

3. Complete Real-Time Updates

Connect the Socket.IO client to backend events so delivery assignments and status changes can update without requiring manual refreshes.

4. Implement Delivery Confirmation

Provide and integrate the backend confirmation endpoint required by the frontend workflow.

5. Rider Availability

Add rider availability information to help dispatchers make better assignment decisions.

6. Notifications

Add SMS, push, or other notification mechanisms for important delivery status changes.

7. Reporting

Add operational reporting for:

- Delivery volume
- Completion rates
- Turnaround time
- Rider activity
- Failed/cancelled deliveries

8. Automated Testing

Expand automated frontend, API, and integration testing to reduce regressions between development, Replit, and Render deployments.

---

Project Goal

The goal of Reflex Control Room is to provide a clear, responsive, and operationally focused interface for managing last-mile delivery workflows.

The final experience should allow an operator to:

See what is happening → Understand what needs attention → Take action → Confirm the outcome.

Reflex transforms fragmented delivery coordination into a shared, structured, and auditable operational workflow.
