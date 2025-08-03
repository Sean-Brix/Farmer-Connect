# Account Module ERD

This diagram shows the core user management system of the Farmer-Connect application.

## Entities

### Account
- **Primary Entity**: Central user management table
- **Access Levels**: User, Admin, Super_Admin
- **Client Profiles**: Various farmer and stakeholder categories
- **Authentication**: Stores login credentials and profile data

### Commodity
- **Purpose**: Agricultural commodities/crops that users work with
- **Usage**: Links farmers to their specific agricultural focus areas

### AccountCommodity
- **Type**: Junction table for many-to-many relationship
- **Purpose**: Associates users with their relevant commodities

## Relationships

- One Account can have multiple Commodities (many-to-many via AccountCommodity)
- Account serves as the central entity linking to all other system modules
- Accounts participate in seminars, make item requests, and create audit logs

## Key Features

- **Role-based Access Control**: Different access levels for system security
- **Profile Management**: Comprehensive user profile information
- **Multi-category Support**: Users can be associated with multiple commodities
- **Audit Trail**: Links to system logging for admin actions
