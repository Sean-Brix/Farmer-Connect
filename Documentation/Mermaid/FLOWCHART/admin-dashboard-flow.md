# Admin Dashboard Flow - Farmer Connect

## Dashboard Access Control Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits /admin] --> B[Check authentication]
    B --> C[GET /api/account/details/me]
    C --> D{Response successful?}
    D -->|No| E[Show 401 Unauthorized modal]
    D -->|Yes| F{User access level?}
    F -->|User| E
    F -->|Admin| G[Load admin interface]
    E --> H[Display error message]
    H --> I[Show Go to Login button]
    I --> J[Redirect to /login]
    G --> K[Initialize dashboard components]
    K --> L[Load sidebar navigation]
    L --> M[Set default page to Analytics]

    style A fill:#e1f5fe
    style G fill:#c8e6c9
    style M fill:#c8e6c9
    style E fill:#ffcdd2
    style J fill:#fff3e0
```

## Sidebar Navigation Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Sidebar loads] --> B[Display admin profile]
    B --> C[Show navigation menu items]
    C --> D[User clicks menu item]
    D --> E{Selected page?}
    E -->|Analytics| F[Load Analytics component]
    E -->|User Profiles| G[Load Profiles component]
    E -->|Seminar Programs| H[Load Seminar component]
    E -->|EIC Items| I[Load EIC component]
    E -->|Distributions| J[Load Distribution component]
    E -->|Inventory| K[Load Inventory component]
    E -->|Logs/Audit| L[Load Audit component]
    E -->|Survey Forms| M[Load Survey component]
    E -->|Settings| N[Load Settings component]
    F --> O[Update active page state]
    G --> O
    H --> O
    I --> O
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
    O --> P[Highlight selected menu item]
    P --> Q[Render page component]

    style A fill:#e1f5fe
    style Q fill:#c8e6c9
```

## Mobile Dashboard Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Mobile dashboard loads] --> B[Hide desktop sidebar]
    B --> C[Show hamburger menu button]
    C --> D[User taps hamburger]
    D --> E[Slide in mobile sidebar]
    E --> F[Display navigation options]
    F --> G[User selects menu item]
    G --> H[Update page component]
    H --> I[Close mobile sidebar]
    I --> J[Show selected page content]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## Admin Profile Management Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Profile section loads] --> B[Display admin picture]
    B --> C[Show username and position]
    C --> D[User clicks profile area]
    D --> E[Navigate to account settings]
    E --> F[Load account profile page]
    F --> G[Allow profile editing]
    G --> H[User saves changes]
    H --> I[Update profile data]
    I --> J[Refresh dashboard display]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## Logout Confirmation Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks Logout] --> B[Show modern confirmation modal]
    B --> C[Display logout question]
    C --> D{User choice?}
    D -->|Cancel| E[Close modal, stay logged in]
    D -->|Logout| F[Process logout request]
    F --> G[Send DELETE to /auth/logout]
    G --> H[Clear authentication data]
    H --> I[Clear local storage]
    I --> J[Clear session storage]
    J --> K[Navigate to /login]

    style A fill:#e1f5fe
    style E fill:#fff3e0
    style K fill:#c8e6c9
```

## Page State Management Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Page component change] --> B[Update current page key]
    B --> C[Store page state]
    C --> D[Update sidebar highlighting]
    D --> E[Scroll to top]
    E --> F[Render new component]
    F --> G[Initialize component data]
    G --> H[Component ready for interaction]

    style A fill:#e1f5fe
    style H fill:#c8e6c9
```

## Responsive Layout Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Dashboard loads] --> B[Check screen size]
    B --> C{Screen width?}
    C -->|< 751px| D[Mobile layout]
    C -->|751px - 1300px| E[Medium layout]
    C -->|> 1300px| F[Large layout]
    D --> G[Full width content]
    E --> H[Adjust sidebar width]
    F --> I[Standard sidebar width]
    G --> J[Mobile navigation]
    H --> K[Responsive content area]
    I --> L[Fixed sidebar position]
    J --> M[Layout optimized]
    K --> M
    L --> M

    style A fill:#e1f5fe
    style M fill:#c8e6c9
```

## Error Handling Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Error occurs] --> B{Error type?}
    B -->|Authentication| C[Show 401 modal]
    B -->|Network| D[Show connection error]
    B -->|Data loading| E[Show loading spinner]
    B -->|Component error| F[Show error boundary]
    C --> G[Provide login option]
    D --> H[Show retry button]
    E --> I[Continue loading state]
    F --> J[Show fallback UI]
    G --> K[Navigate to authentication]
    H --> L[Retry failed operation]
    I --> M[Complete when data loads]
    J --> N[Allow manual recovery]

    style A fill:#e1f5fe
    style K fill:#fff3e0
    style L fill:#fff3e0
    style M fill:#c8e6c9
    style N fill:#c8e6c9
```

## Off-Page Connectors

-   **From Client Landing**: A ⟵ [Client Landing Flow](client-landing-flow.md)
-   **From Authentication**: B ⟵ [Authentication Flow](authentication-flow.md)
-   **To Analytics Page**: C ⟶ [Analytics Flow](analytics-flow.md)
-   **To User Management**: D ⟶ [User Management Flow](user-management-flow.md)
-   **To Seminar Management**: E ⟶ [Seminar Management Flow](seminar-management-flow.md)
-   **To EIC Management**: F ⟶ [EIC Management Flow](eic-management-flow.md)
-   **To Inventory Management**: G ⟶ [Inventory Management Flow](inventory-management-flow.md)
