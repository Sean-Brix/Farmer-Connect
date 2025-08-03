# Farmer-Connect System Diagrams

This directory contains comprehensive system documentation through Entity Relationship Diagrams (ERD), Flowcharts, and Data Flow Diagrams (DFD) for the Farmer-Connect agricultural management platform.

## Directory Structure

```
MERMAID/
├── ERD/                    # Entity Relationship Diagrams
│   ├── account-module.mmd
│   ├── inventory-module.mmd
│   ├── seminar-module.mmd
│   └── audit-module.mmd
├── Flowchart/              # System Process Flowcharts
│   ├── authentication-flow.mmd
│   ├── admin-system-management.mmd
│   ├── admin-content-management.mmd
│   ├── item-request-flow.mmd
│   ├── seminar-registration.mmd
│   ├── seminar-attendance.mmd
│   ├── profile-personal-info.mmd
│   ├── profile-security-settings.mmd
│   ├── profile-media-contacts.mmd
│   ├── landing-navigation-hero.mmd
│   ├── landing-content-sections.mmd
│   └── landing-footer-navigation.mmd
├── DFD/                    # Data Flow Diagrams
│   ├── context-level-dfd.mmd
│   ├── level-1-dfd.mmd
│   └── admin-system-dfd.mmd
└── Use_Case/               # Use Case Diagrams
    ├── user-use-cases.mmd
    ├── equipment-use-cases.mmd
    ├── admin-use-cases.mmd
    ├── inventory-admin-use-cases.mmd
    └── super-admin-use-cases.mmd
```

## System Overview

The Farmer-Connect system is a comprehensive agricultural management platform designed to support farmers and agricultural organizations through:

- **User Management**: Role-based access control with farmers, administrators, and super administrators
- **Educational Services**: Seminar management for farmer training and capacity building
- **Equipment Management**: Both lending (EIC) and distribution systems for agricultural tools
- **Analytics**: Comprehensive reporting and data analysis capabilities
- **Audit System**: Complete activity tracking for compliance and security

## Diagram Categories

### Entity Relationship Diagrams (ERD)
Modular database design documentation showing:
- **Account Module**: User management and authentication
- **Inventory Module**: Equipment and transaction management
- **Seminar Module**: Educational event management
- **Audit Module**: System logging and compliance

### Flowcharts
User journey and process documentation including:
- **Authentication Flow**: Login, registration, and session management
- **Admin System Management**: Administrative analytics, user management, and system oversight
- **Admin Content Management**: Content creation for seminars and inventory management
- **Item Request Flow**: Equipment lending and distribution processes
- **Seminar Registration**: Seminar discovery and registration process
- **Seminar Attendance**: Event attendance tracking and post-event processing
- **Profile Personal Info**: User personal information management and validation
- **Profile Security Settings**: Account security, passwords, 2FA, and privacy controls
- **Profile Media & Contacts**: Profile pictures, contact info, and user preferences
- **Landing Navigation & Hero**: Main page navigation and hero section functionality
- **Landing Content Sections**: Programs, about, and news content display
- **Landing Footer Navigation**: Footer links, contact info, and social media integration

### Data Flow Diagrams (DFD)
System architecture and data movement documentation:
- **Context Level**: High-level system overview with external entities
- **Level 1**: Detailed process breakdowns and data flows
- **Admin System**: Administrative functionality and data management

### Use Case Diagrams
Actor-based functionality documentation:
- **User Use Cases**: Core user functionality and services
- **Equipment Use Cases**: EIC and distribution system interactions
- **Admin Use Cases**: Administrative management capabilities
- **Inventory Admin Use Cases**: Equipment management workflows
- **Super Admin Use Cases**: System oversight and advanced administration

## Design Constraints

All diagrams follow these design principles:
- **Maximum Width**: 8 shapes horizontally
- **Shape Limit**: 13-20 shapes per diagram
- **Vertical Layout**: Emphasis on vertical arrangement for better readability
- **Color Scheme**: Black text throughout for consistency
- **Modular Design**: Split complex systems into focused, manageable diagrams

## Technical Implementation

- **Format**: Mermaid (.mmd) files for version control and collaboration
- **Rendering**: Compatible with GitHub, VS Code, and other Mermaid-enabled platforms
- **Documentation**: Each diagram includes comprehensive markdown explanation
- **Maintenance**: Living documentation updated with system changes

## Usage

These diagrams serve multiple purposes:
- **Development Reference**: Technical specifications for developers
- **System Documentation**: Comprehensive system understanding for stakeholders
- **Training Materials**: Visual aids for system training and onboarding
- **Compliance**: Audit and regulatory documentation requirements

## File Naming Convention

- **ERD Files**: `{module-name}-module.mmd`
- **Flowchart Files**: `{process-name}-flow.mmd`
- **DFD Files**: `{level}-level-dfd.mmd`
- **Use Case Files**: `{actor-type}-use-cases.mmd`
- **Documentation**: Corresponding `.md` files for each diagram
