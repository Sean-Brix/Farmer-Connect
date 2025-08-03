# Audit Module ERD

This diagram represents the comprehensive audit logging system for tracking all administrative actions.

## Entities

### AuditLog
- **Purpose**: Complete activity tracking for compliance and security
- **Action Types**: Account management, inventory operations, seminar management, system actions
- **Metadata**: Structured JSON data for detailed action context
- **Traceability**: IP addresses and user agent tracking

## Relationships

- Each AuditLog is created by an Account (admin/super admin only)
- Links to various system entities through targetType and targetId

## Key Features

- **Comprehensive Tracking**: All administrative actions are logged
- **Rich Context**: Detailed metadata for each action including before/after values
- **Security**: IP address and user agent tracking for forensic analysis
- **Flexible Structure**: JSON metadata allows for action-specific information
- **Compliance**: Maintains audit trail for regulatory requirements

## Action Categories

- **Authentication**: Login/logout activities
- **Account Management**: User creation, updates, role changes
- **Inventory Operations**: Item management, distribution approvals
- **Seminar Management**: Event creation, participant management
- **System Operations**: Backups, maintenance, settings changes
