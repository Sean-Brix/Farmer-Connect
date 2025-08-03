# Context Level DFD (Level 0)

This diagram shows the highest level view of the Farmer-Connect system and its interactions with external entities.

## External Entities

### Farmers/Users
- **Primary Users**: Agricultural community members
- **Activities**: Registration, seminar enrollment, equipment requests
- **Access Level**: Standard user permissions

### Administrators  
- **Role**: System managers and agricultural office staff
- **Responsibilities**: Content management, request approvals, user support
- **Access Level**: Administrative permissions

### System Admin
- **Role**: Technical system administrator
- **Responsibilities**: System monitoring, user management, audit oversight
- **Access Level**: Super administrative permissions

## Core System Processes

### Authentication Service
- **Function**: User login/logout and session management
- **Security**: JWT token-based authentication
- **Integration**: Central authentication for all system modules

### User Management
- **Function**: User registration, profile management, role assignment
- **Features**: Comprehensive user data handling and account lifecycle

### Seminar Management
- **Function**: Educational event creation, enrollment, and tracking
- **Capabilities**: Full seminar lifecycle from creation to completion

### Inventory Management
- **Function**: Agricultural equipment tracking and distribution
- **Systems**: Both EIC (lending) and Distribution (permanent) management

### Analytics Service
- **Function**: System usage analytics and reporting
- **Purpose**: Data-driven insights for decision making

### Audit Service
- **Function**: Comprehensive activity logging and compliance
- **Security**: Complete audit trail for all administrative actions

## Data Flow Characteristics

- **Bidirectional**: Most processes involve both input and output flows
- **Secure**: All data flows are protected by authentication and authorization
- **Comprehensive**: Complete coverage of all system functionalities
- **Scalable**: Designed to handle growing user base and data volume
