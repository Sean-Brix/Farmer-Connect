# EIC (Equipment in Circulation) Module

This module manages the EIC system for tracking and lending farm equipment.

## Structure

```
EIC/
├── EIC.jsx                 # Main component with TanStack Query integration
├── addEICItem.jsx          # Modal component for adding new EIC items
├── constants.js            # Shared constants (categories, statuses)
├── hooks/
│   └── useEICQueries.js    # TanStack Query hooks for API operations
└── utils/
    └── helpers.js          # Utility functions
```

## Features

-   **Equipment Management**: View, add, and edit equipment in circulation
-   **Request Management**: Handle equipment borrowing requests with status updates
-   **Real-time Updates**: TanStack Query provides automatic caching and background updates
-   **Image Support**: Upload and manage equipment photos
-   **Status Tracking**: Complete lifecycle tracking from request to return

## TanStack Query Integration

The module uses TanStack Query for:

-   Automatic caching and background refetching
-   Optimistic updates
-   Loading and error state management
-   Data synchronization across components

## API Endpoints Used

-   `GET /api/eic/all` - Fetch all EIC stacks
-   `GET /api/eic/request/all` - Fetch all requests
-   `GET /api/inventory/all/items` - Fetch inventory items for adding to EIC
-   `POST /api/inventory/item/add` - Add new item to EIC
-   `PUT /api/eic/item/:id` - Update EIC item
-   `POST /api/eic/request/respond` - Update request status

## Usage

The component is automatically wrapped with TanStack Query providers in the main app, providing:

-   Automatic data fetching
-   Background updates
-   Optimized re-renders
-   Error handling
