# Inventory Management - Refactored Structure

## Overview

The inventory management system has been refactored from a single large file into a well-organized, modular structure for better maintainability and readability.

## File Structure

```
Inventory/
├── constants.js                    # Shared constants (categories, statuses, etc.)
├── addItem.jsx                    # Add item modal component (existing)
├── Inventory.jsx                  # Original file (kept for reference)
├── InventoryRefactored.jsx        # New refactored main component
├── components/
│   ├── index.js                   # Component exports
│   ├── modals/
│   │   ├── EditItemModal.jsx      # Edit item functionality
│   │   ├── DeleteConfirmationModal.jsx  # Delete confirmation dialog
│   │   ├── DeleteStackModal.jsx   # Stack deletion confirmation
│   │   ├── StackEditModal.jsx     # Stack editing functionality
│   │   └── StacksModal.jsx        # Stack viewing modal
│   └── ui/
│       ├── Alert.jsx              # Alert notifications
│       ├── Header.jsx             # Search, filters, and actions
│       └── InventoryTable.jsx     # Main data table
├── hooks/
│   └── useInventory.js           # Custom hook for state management
└── utils/
    ├── helpers.js                # Utility functions
    └── inventoryHandlers.js      # Event handlers
```

## Components

### Main Component

-   **InventoryRefactored.jsx**: The main component that orchestrates all other components

### Modal Components

-   **EditItemModal**: Handles item editing with form validation
-   **DeleteConfirmationModal**: Confirms bulk item deletion
-   **DeleteStackModal**: Confirms individual stack deletion
-   **StackEditModal**: Handles stack quantity modifications and transfers
-   **StacksModal**: Displays detailed stack information

### UI Components

-   **Alert**: Shows success/error notifications
-   **Header**: Contains search, filters, and action buttons
-   **InventoryTable**: Main data table with expandable rows for stack details

### Hooks

-   **useInventory**: Custom hook that manages all inventory-related state

### Utilities

-   **helpers.js**: Common utility functions (truncate, convertToSnakeCase, groupStacksByStatus)
-   **inventoryHandlers.js**: All event handlers and business logic
-   **constants.js**: Shared constants and configurations

## Benefits of Refactoring

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused in other parts of the application
3. **Maintainability**: Easier to locate and fix bugs or add new features
4. **Testability**: Smaller components are easier to unit test
5. **Code Organization**: Logical grouping of related functionality
6. **Performance**: Smaller components allow for better optimization opportunities

## Usage

To use the refactored version, simply import and use `InventoryRefactored` instead of the original `Inventory` component:

```jsx
import InventoryRefactored from './InventoryRefactored';

// Use in your app
<InventoryRefactored />;
```

## Migration Notes

-   All functionality from the original component is preserved
-   Props and API remain the same
-   The component structure is more modular but behavior is identical
-   The original file is kept for reference during transition
