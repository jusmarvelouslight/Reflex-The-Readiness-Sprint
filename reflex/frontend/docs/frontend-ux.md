# Reflex Sprint — Frontend & UX Specification

## 1. Overview

The Reflex Sprint frontend is designed as the **Reflex Control Room**.

It is an operational dashboard for monitoring and managing last-mile delivery activity.

The interface is designed around a simple operational principle:

```text
SEE → UNDERSTAND → ACT → CONFIRM
```

The user should be able to quickly understand what is happening, identify deliveries requiring attention, perform an appropriate action, and receive clear feedback.

---

# 2. Frontend Technology

The prototype uses:

* React
* Vite
* TypeScript
* CSS

The prototype is being developed using **Replit**.

The frontend should remain compatible with the project's GitHub repository structure.

---

# 3. Visual Design

The Reflex Control Room uses a refined operational visual identity built around:

### Emerald Green

Primary interface colour.

Used for:

* Navigation
* Primary actions
* Active states
* Progress
* Positive operational states
* Key interface elements

Emerald communicates reliability, stability, and operational control.

---

### Warm Beige

Primary environmental colour.

Used for:

* Page backgrounds
* Supporting surfaces
* Filters
* Secondary interface areas
* Soft status backgrounds

The beige background creates a softer and more approachable environment than a completely white dashboard.

---

### Dark Red

Secondary attention colour.

Used selectively for:

* Failed deliveries
* Cancelled deliveries
* Critical alerts
* Destructive actions

Dark red should not dominate the interface.

Its limited use makes it visually meaningful when an exception occurs.

---

# 4. UX Principles

## Clarity

Important information should be immediately understandable.

## Operational Focus

The interface should prioritize information that helps the user monitor and manage deliveries.

## Visual Hierarchy

Primary information should be more visually prominent than secondary information.

## Consistency

Buttons, cards, badges, forms, tables, and navigation should follow the same visual language.

## Feedback

The interface should communicate the result of important actions.

## Responsiveness

The Control Room should remain usable on desktop, tablet, and mobile screens.

---

# 5. Dashboard UX

The Dashboard is the primary landing screen.

It should provide an immediate operational overview.

### Dashboard information

* Total deliveries
* Active deliveries
* Deliveries in transit
* Completed deliveries
* Alerts
* Recent delivery activity

The user should be able to answer:

> "What is happening with deliveries right now?"

without needing to open multiple pages.

---

# 6. Deliveries UX

The Deliveries page is the main operational workspace.

The page should provide:

* Delivery ID
* Customer information
* Destination
* Rider
* Delivery status
* Relevant timestamps
* Available actions

### Search

Users should be able to search delivery records.

### Filtering

Users should be able to filter deliveries by status or other available operational criteria.

### Details

Selecting a delivery should reveal additional information without making the user lose their place in the workflow.

---

# 7. Riders UX

The Riders page provides visibility into riders and their delivery assignments.

The interface may display:

* Rider name
* Rider status
* Current assignment
* Delivery information
* Availability information where supplied by the backend

The frontend should present backend-provided information rather than inventing operational rules.

---

# 8. Core Delivery Actions

The frontend is designed around five key delivery operations.

## 1. View Deliveries

The user views delivery records through the Deliveries page.

## 2. Create Delivery

The user enters delivery information through the New Delivery interface.

## 3. Assign Rider

The user selects a rider for an appropriate delivery.

## 4. Update Status

The user updates the delivery status when the workflow allows it.

## 5. Confirm Delivery

The user completes the delivery confirmation workflow.

These actions correspond to backend operations but the frontend is responsible only for the user-facing interface and API request initiation.

---

# 9. Delivery Status UX

Supported delivery states include:

```text
REQUESTED
ASSIGNED
IN_TRANSIT
DELIVERED
FAILED
CANCELLED
```

Each status should be presented using:

* Text
* Status badge
* Appropriate visual treatment

Colour should reinforce the status rather than being the only method of communicating it.

---

# 10. Status Hierarchy

### Requested

Delivery has been created and requires further processing.

### Assigned

A rider has been associated with the delivery.

### In Transit

The delivery is currently being transported.

### Delivered

The delivery has been successfully completed.

### Failed

The delivery could not be completed successfully.

### Cancelled

The delivery has been cancelled.

---

# 11. Component Structure

The frontend should use reusable React components.

```text
components/
├── Sidebar.tsx
├── Topbar.tsx
├── MetricCard.tsx
├── DeliveryTable.tsx
├── StatusBadge.tsx
├── DeliveryDetails.tsx
└── NewDeliveryModal.tsx
```

Reusable components prevent duplicated UI logic and help maintain consistency.

---

# 12. Page Structure

```text
pages/
├── Dashboard.tsx
├── Deliveries.tsx
└── Riders.tsx
```

Pages compose reusable components.

Components handle specific interface responsibilities.

---

# 13. API Integration UX

The frontend should communicate with the backend through the API layer.

The UI should not contain direct database operations.

Expected flow:

```text
User Action
     ↓
React Component
     ↓
API Function
     ↓
apiClient
     ↓
Backend API
     ↓
Response
     ↓
React UI Update
```

---

# 14. Loading States

The interface should provide visual feedback while waiting for API operations.

Examples include:

* Loading indicators
* Disabled action buttons
* Skeleton or placeholder states
* Loading text

The user should not be left wondering whether an action is processing.

---

# 15. Success Feedback

Successful operations should provide clear confirmation.

Examples:

```text
Delivery created successfully.
Rider assigned successfully.
Delivery status updated.
Delivery confirmed successfully.
```

Feedback should be brief and understandable.

---

# 16. Error Feedback

Technical API errors should be translated into user-friendly messages.

Examples:

### Connection failure

```text
Unable to connect to the Reflex server. Please try again.
```

### Authentication failure

```text
Your session has expired. Please sign in again.
```

### Permission failure

```text
You do not have permission to perform this action.
```

### Server failure

```text
Reflex is temporarily unavailable. Please try again.
```

The interface should avoid displaying unnecessary technical implementation details to operational users.

---

# 17. Forms

The New Delivery form should provide clear labels for:

* Customer name
* Phone number
* Address
* Delivery items

Forms should provide:

* Required-field indicators where appropriate
* Clear labels
* Validation feedback
* Submit state
* Error feedback
* Success feedback

The frontend may perform basic client-side validation.

The backend remains responsible for authoritative validation.

---

# 18. Responsive Design

## Desktop

Desktop layout should provide:

* Persistent navigation
* Dashboard metrics
* Full delivery table
* Multi-column information panels

## Tablet

The interface should reduce density while retaining the main operational workflows.

## Mobile

The interface should prioritize:

* Vertical content
* Accessible navigation
* Scrollable delivery tables
* Full-width forms
* Full-width modal actions

The goal is to preserve usability rather than simply shrinking the desktop interface.

---

# 19. Accessibility

The frontend should follow basic accessibility principles.

This includes:

* Keyboard-accessible controls
* Visible focus indicators
* Clear labels
* Sufficient contrast
* Readable typography
* Status text in addition to colour
* Responsive layouts
* Reduced-motion support where appropriate

Interactive elements should use appropriate semantic HTML.

---

# 20. Navigation

The primary navigation should contain:

```text
Dashboard
Deliveries
Riders
```

The active section should be visually distinguishable.

Navigation should remain predictable and consistent.

---

# 21. Information Hierarchy

The interface should prioritize information in this order:

```text
1. Operational status
2. Delivery information
3. Exceptions / alerts
4. Available actions
5. Supporting details
```

This hierarchy allows users to scan the interface quickly.

---

# 22. UX Responsibility Boundary

The Frontend/UX contribution is responsible for:

* UI design
* React components
* Page structure
* Navigation
* Responsive behaviour
* Visual hierarchy
* Forms
* Interaction design
* Status presentation
* API integration structure
* Client-side error presentation

The Frontend/UX contribution does not claim ownership of:

* Supabase database implementation
* Supabase queries
* Backend endpoints
* Server-side business logic
* Server-side authentication
* Server-side validation
* CORS configuration
* Backend infrastructure

---

# 23. Replit Implementation Guidance

The Replit implementation should reproduce the Reflex Control Room described in this document.

The implementation should:

* Use React
* Use TypeScript
* Use Vite
* Use CSS
* Maintain the emerald/beige/dark-red visual system
* Follow the component structure
* Follow the page structure
* Use reusable components
* Keep API logic separated from UI components
* Use mock data where the backend is not yet available
* Keep the frontend ready for eventual API integration

Replit should not create a replacement backend or Supabase implementation as part of the frontend prototype.

---

# 24. Prototype Data

Until the backend API is connected, the frontend may use clearly identified mock data to demonstrate:

* Delivery records
* Rider information
* Delivery statuses
* Dashboard metrics
* Operational activity

Mock data should be structured to resemble the expected TypeScript API types.

When the backend becomes available, the mock data layer can be replaced by API responses.

---

# 25. Design Rationale

The Reflex Control Room uses an operational dashboard because the primary UX requirement is rapid visibility and action.

The visual system intentionally assigns functional meaning to the main colours:

```text
Emerald Green → normal operations / actions / progress

Warm Beige → background / supporting information

Dark Red → exceptions / failures / critical attention
```

This creates a visual hierarchy without relying on excessive decoration.

---

# 26. Prototype Goal

The goal of the frontend prototype is to demonstrate a realistic, polished operational interface that can later consume the backend API.

The frontend should therefore demonstrate:

* A coherent information architecture
* Clear operational workflows
* Responsive UI
* Consistent component design
* Meaningful status presentation
* API-ready structure
* Clear separation between frontend and backend responsibilities

The final interface should feel like a practical **Reflex Control Room**, rather than a generic dashboard template.
