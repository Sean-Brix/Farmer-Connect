# Client Landing Page Flow - Farmer Connect

## Landing Page Navigation Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits / root] --> B[Load Landing Component]
    B --> C[Load Navbar Component]
    C --> D[Check user authentication status]
    D --> E{Is authenticated?}
    E -->|No| F[Show Guest Account status]
    E -->|Yes| G[Load user details from /api/accounts/details]
    G --> H[Display username and position]
    F --> I[Set Login button as 'Login Now']
    H --> J[Set Login button as 'Logout']
    I --> K[Display main content sections]
    J --> K
    K --> L[Hero Section with video background]
    L --> M[Programs carousel slider]
    M --> N[Statistics section]
    N --> O[News and updates section]
    O --> P[Contact information]
    P --> Q[User interaction ready]

    style A fill:#e1f5fe
    style Q fill:#c8e6c9
```

## Navbar Interaction Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User interacts with Navbar] --> B{Navigation choice?}
    B -->|Home| C[Scroll to top]
    B -->|Profile| D{User authenticated?}
    D -->|No| E[Redirect to /login]
    D -->|Yes| F[Navigate to /profiles]
    B -->|Enrollment| G[Navigate to /enrollment]
    B -->|EIC| H[Navigate to /EIC]
    B -->|Settings| I[Navigate to /settings]
    B -->|Distributions| J[Navigate to /distribution]
    B -->|About| K[Navigate to /about]
    B -->|Contact| L[Navigate to /contact]
    B -->|Login/Logout| M{Current state?}
    M -->|Guest| N ⟶ [Authentication Flow](authentication-flow.md)
    M -->|Logged in| O ⟶ [Authentication Flow](authentication-flow.md)

    style A fill:#e1f5fe
    style C fill:#c8e6c9
    style E fill:#fff3e0
    style F fill:#c8e6c9
    style G fill:#c8e6c9
    style H fill:#c8e6c9
    style I fill:#c8e6c9
    style J fill:#c8e6c9
    style K fill:#c8e6c9
    style L fill:#c8e6c9
```

## Programs Carousel Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Programs carousel loads] --> B[Initialize with FITS Program]
    B --> C[User can navigate slides]
    C --> D{User action?}
    D -->|Next button| E[Move to next program]
    D -->|Previous button| F[Move to previous program]
    D -->|Auto advance| G[Auto slide after timer]
    D -->|Dots navigation| H[Jump to specific slide]
    E --> I[Update active slide]
    F --> I
    G --> I
    H --> I
    I --> J[Animate transition]
    J --> K[Update slide indicators]
    K --> C

    style A fill:#e1f5fe
    style K fill:#c8e6c9
```

## Statistics Dashboard Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Statistics section loads] --> B[Fetch analytics data]
    B --> C[GET /api/analytics/overview]
    C --> D{Data received?}
    D -->|No| E[Show loading state]
    D -->|Yes| F[Parse statistics data]
    F --> G[Display total farmers]
    G --> H[Display active programs]
    H --> I[Display distributions made]
    I --> J[Display equipment items]
    J --> K[Animate counters]
    K --> L[Statistics ready for viewing]

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style E fill:#fff3e0
```

## Mobile Responsive Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Page loads on mobile] --> B[Check screen size]
    B --> C{Screen < 768px?}
    C -->|No| D[Display desktop navbar]
    C -->|Yes| E[Display mobile hamburger menu]
    E --> F[User taps hamburger]
    F --> G[Slide in mobile sidebar]
    G --> H[Show navigation options]
    H --> I[User selects option]
    I --> J[Close mobile sidebar]
    J --> K[Navigate to selected page]

    style A fill:#e1f5fe
    style D fill:#c8e6c9
    style K fill:#c8e6c9
```

## News and Updates Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[News section loads] --> B[Fetch latest announcements]
    B --> C[GET /api/news/latest]
    C --> D{News data available?}
    D -->|No| E[Show default news placeholder]
    D -->|Yes| F[Display news cards]
    F --> G[Show news title and date]
    G --> H[Show news excerpt]
    H --> I[Add Read More button]
    I --> J[User clicks Read More]
    J --> K[Navigate to full article]

    style A fill:#e1f5fe
    style E fill:#fff3e0
    style K fill:#c8e6c9
```

## Off-Page Connectors

-   **From Authentication**: A ⟵ [Authentication Flow](authentication-flow.md)
-   **To EIC Page**: B ⟶ [EIC Flow](eic-flow.md)
-   **To Seminar Page**: C ⟶ [Seminar Flow](seminar-flow.md)
-   **To Distribution Page**: D ⟶ [Distribution Flow](distribution-flow.md)
-   **To Profile Settings**: E ⟶ [Settings Flow](settings-flow.md)
-   **To Admin Dashboard**: F ⟶ [Admin Dashboard Flow](admin-dashboard-flow.md)
