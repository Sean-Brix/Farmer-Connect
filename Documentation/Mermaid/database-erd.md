# Farmer Connect Database ERD - Clean Diagram

## Entity Relationship Diagram

```mermaid
%%{init: {'er': {'curve': 'linear'}, 'theme': 'base', 'themeVariables': {'primaryColor': '#ffffff', 'primaryTextColor': '#000000', 'primaryBorderColor': '#000000', 'lineColor': '#000000'}}}%%
erDiagram

    %% Main Relationships
    Account ||--o{ AccountCommodity : "has"
    Account ||--o{ SeminarParticipant : "participates"
    Account ||--o{ ItemTransaction : "requests"
    Account ||--o{ ItemTransaction : "administers"
    Account ||--o{ Seminar : "creates"
    Account ||--o{ AuditLog : "performs"

    Commodity ||--o{ AccountCommodity : "assigned_to"
    Seminar ||--o{ SeminarParticipant : "includes"
    InventoryItem ||--o{ ItemStack : "contains"
    ItemStack ||--o{ ItemTransaction : "involves"

    %% Entities with clean column format
    Account {
        PK id string
        UK username string
        UK email string
        access enum
        firstName string
        lastName string
        middleName string
        gender enum
        client_profile enum
        cellphone_no string
        telephone_no string
        occupation string
        position string
        institution string
        address string
        picture bytes
        mimeType string
        password string
        createdAt datetime
        updatedAt datetime
    }

    Commodity {
        PK id string
        UK name string
        icon string
        description string
        createdAt datetime
        updatedAt datetime
    }

    AccountCommodity {
        PK id string
        FK account_id string
        FK commodity_id string
        createdAt datetime
        updatedAt datetime
    }

    Seminar {
        PK id string
        title string
        description text
        location string
        speaker string
        start_date date
        end_date date
        start_time string
        end_time string
        capacity int
        registration_deadline date
        status enum
        picture bytes
        mimeType string
        FK createdById string
        createdAt datetime
        updatedAt datetime
    }

    SeminarParticipant {
        PK id string
        FK seminar_id string
        FK account_id string
        status enum
        createdAt datetime
        updatedAt datetime
    }

    InventoryItem {
        PK id string
        UK name string
        description string
        picture bytes
        category enum
        createdAt datetime
        updatedAt datetime
    }

    ItemStack {
        PK id string
        FK itemId string
        quantity int
        status enum
        date_limit int
        createdAt datetime
        updatedAt datetime
    }

    ItemTransaction {
        PK id string
        FK itemStackId string
        FK accountId string
        FK adminId string
        quantity int
        status enum
        pickupDate datetime
        returnDate datetime
        requestNote string
        createdAt datetime
        updatedAt datetime
    }

    AuditLog {
        PK id string
        FK adminId string
        action enum
        targetType string
        targetId string
        targetName string
        details text
        metadata json
        ipAddress string
        userAgent string
        createdAt datetime
    }
```
