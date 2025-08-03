# Inventory Module ERD

This diagram represents the inventory and item management system for agricultural equipment and tools.

## Entities

### InventoryItem
- **Purpose**: Master catalog of all available agricultural items
- **Categories**: Farming Equipment, Harvesting Tools, Irrigation Systems, etc.
- **Content**: Basic item information, descriptions, and photos

### ItemStack
- **Purpose**: Represents specific quantities/batches of inventory items
- **Status Types**: Available, Unavailable, Damaged, EIC, Distributed
- **Functionality**: Tracks quantity, condition, and lending limits

### ItemTransaction
- **Purpose**: Records all item lending/distribution activities
- **Status Flow**: Pending → Approved → Returned (or various rejection states)
- **Tracking**: Manages pickup dates, return dates, and transaction notes

## Relationships

- One InventoryItem can have multiple ItemStacks (different batches/conditions)
- One ItemStack can have multiple ItemTransactions (lending history)
- Each transaction links to both requester and approving admin

## Key Features

- **Batch Management**: Multiple stacks per item for better inventory control
- **Status Tracking**: Complete lifecycle management from request to return
- **Multi-purpose Usage**: Supports both EIC (lending) and Distribution (giving)
- **Admin Oversight**: All transactions require admin approval and tracking
