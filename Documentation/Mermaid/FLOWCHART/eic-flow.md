# EIC (Equipment Information Center) Flow - Farmer Connect

## EIC Landing Page Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits /eic] --> B[Load EIC Component]
    B --> C[Load Client Navbar]
    C --> D[Check user authentication]
    D --> E{Is authenticated?}
    E -->|No| F[Show guest mode features]
    E -->|Yes| G[Load user-specific features]
    F --> H[Display public EIC catalog]
    G --> I[Display personalized EIC features]
    H --> J[Show equipment categories]
    I --> J
    J --> K[Load equipment items]
    K --> L[Display search and filters]
    L --> M[User ready to browse equipment]

    style A fill:#e1f5fe
    style M fill:#c8e6c9
```

## Equipment Browsing Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User browses equipment] --> B[Display equipment grid]
    B --> C[Show equipment cards]
    C --> D[User interacts with equipment]
    D --> E{User action?}
    E -->|View Details| F[Open equipment modal]
    E -->|Search| G[Filter equipment list]
    E -->|Category Filter| H[Apply category filter]
    E -->|Borrow Request| I{User authenticated?}
    I -->|No| J[Redirect to login]
    I -->|Yes| K[Open borrow request form]
    F --> L[Show detailed equipment info]
    G --> M[Update equipment display]
    H --> M
    K --> N[Submit borrow request]
    L --> O[Show borrowing options]
    M --> P[Equipment list updated]
    N --> Q[Process request submission]
    O --> R[User can request borrowing]

    style A fill:#e1f5fe
    style P fill:#c8e6c9
    style Q fill:#c8e6c9
    style R fill:#c8e6c9
    style J fill:#fff3e0
```

## Equipment Search Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User enters search] --> B[Capture search input]
    B --> C[Send search query]
    C --> D[GET /api/eic/search?query=term]
    D --> E{Results found?}
    E -->|No| F[Show 'No results found']
    E -->|Yes| G[Display filtered results]
    F --> H[Suggest alternative searches]
    G --> I[Highlight search terms]
    I --> J[Show result count]
    J --> K[Display pagination if needed]
    K --> L[Search results ready]
    H --> M[Clear search to show all]

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style M fill:#fff3e0
```

## Equipment Categories Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Categories load] --> B[Fetch category data]
    B --> C[GET /api/eic/categories]
    C --> D[Display category buttons]
    D --> E[User selects category]
    E --> F[Apply category filter]
    F --> G[Send filtered request]
    G --> H[GET /api/eic/items?category=selected]
    H --> I[Update equipment display]
    I --> J[Show category-specific items]
    J --> K[Update active category indicator]
    K --> L[Category filter applied]

    style A fill:#e1f5fe
    style L fill:#c8e6c9
```

## Equipment Details Modal Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks equipment card] --> B[Open details modal]
    B --> C[Fetch equipment details]
    C --> D[GET /api/eic/item/:id]
    D --> E{Data loaded?}
    E -->|No| F[Show loading spinner]
    E -->|Yes| G[Display equipment information]
    F --> H[Wait for data]
    G --> I[Show equipment image]
    I --> J[Display specifications]
    J --> K[Show availability status]
    K --> L[Display borrowing terms]
    L --> M[Show action buttons]
    M --> N{User authenticated?}
    N -->|No| O[Show login required message]
    N -->|Yes| P[Show borrow request button]
    H --> E

    style A fill:#e1f5fe
    style P fill:#c8e6c9
    style O fill:#fff3e0
```

## Borrow Request Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks Borrow Request] --> B[Open borrow request form]
    B --> C[Load user information]
    C --> D[Pre-fill user details]
    D --> E[Show request form fields]
    E --> F[User fills required information]
    F --> G[User selects borrow duration]
    G --> H[User adds request reason]
    H --> I[User submits request]
    I --> J[Validate form data]
    J --> K{Form valid?}
    K -->|No| L[Show validation errors]
    K -->|Yes| M[Send borrow request]
    L --> F
    M --> N[POST /api/eic/borrow-request]
    N --> O{Request submitted?}
    O -->|No| P[Show submission error]
    O -->|Yes| Q[Show success message]
    P --> I
    Q --> R[Update equipment availability]
    R --> S[Close request form]
    S --> T[Return to equipment list]

    style A fill:#e1f5fe
    style T fill:#c8e6c9
    style P fill:#ffcdd2
```

## Equipment Availability Status Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Equipment loads] --> B[Check availability status]
    B --> C{Equipment status?}
    C -->|Available| D[Show green available badge]
    C -->|Borrowed| E[Show red borrowed badge]
    C -->|Maintenance| F[Show yellow maintenance badge]
    C -->|Reserved| G[Show blue reserved badge]
    D --> H[Enable borrow request]
    E --> I[Disable borrow request]
    F --> J[Show maintenance message]
    G --> K[Show reservation info]
    H --> L[User can request]
    I --> M[Show return date]
    J --> N[Show estimated return]
    K --> O[Show reservation holder]

    style A fill:#e1f5fe
    style L fill:#c8e6c9
    style M fill:#fff3e0
    style N fill:#fff3e0
    style O fill:#fff3e0
```

## Mobile EIC Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Mobile EIC loads] --> B[Optimize layout for mobile]
    B --> C[Stack equipment cards vertically]
    C --> D[Adjust search interface]
    D --> E[Simplify category filters]
    E --> F[Touch-optimize buttons]
    F --> G[Responsive modal dialogs]
    G --> H[Mobile-friendly forms]
    H --> I[Swipe gestures enabled]
    I --> J[Mobile EIC ready]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## EIC Data Synchronization Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Page loads] --> B[Fetch latest EIC data]
    B --> C[Check for updates]
    C --> D{Data changed?}
    D -->|No| E[Use cached data]
    D -->|Yes| F[Update local state]
    E --> G[Display current data]
    F --> H[Refresh equipment list]
    H --> I[Update availability status]
    I --> J[Notify user of updates]
    G --> K[EIC data ready]
    J --> K

    style A fill:#e1f5fe
    style K fill:#c8e6c9
```

## Off-Page Connectors

-   **From Client Landing**: A ⟵ [Client Landing Flow](client-landing-flow.md)
-   **From Admin EIC Management**: B ⟵ [EIC Management Flow](eic-management-flow.md)
-   **To Authentication**: C ⟶ [Authentication Flow](authentication-flow.md)
-   **To User Profile**: D ⟶ [Settings Flow](settings-flow.md)
