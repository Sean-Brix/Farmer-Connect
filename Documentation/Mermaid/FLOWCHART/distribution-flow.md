# Distribution Page Flow - Farmer Connect

## Distribution Landing Page Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits /distribution] --> B[Load Distribution Component]
    B --> C[Load Client Navbar]
    C --> D[Check user authentication status]
    D --> E[Fetch distribution programs]
    E --> F[GET /api/distributions/active]
    F --> G{Distributions loaded?}
    G -->|No| H[Show loading state]
    G -->|Yes| I[Display distribution cards]
    H --> J[Show skeleton loaders]
    I --> K[Show distribution details]
    K --> L[Display application buttons]
    L --> M[User ready to browse distributions]
    J --> N[Wait for data load]
    N --> G

    style A fill:#e1f5fe
    style M fill:#c8e6c9
```

## Distribution Browsing Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User browses distributions] --> B[Display distribution grid]
    B --> C[Show distribution program cards]
    C --> D[User interacts with distribution]
    D --> E{User action?}
    E -->|View Details| F[Open distribution details modal]
    E -->|Apply| G{User authenticated?}
    E -->|Search| H[Filter distribution list]
    E -->|Category Filter| I[Apply category filter]
    G -->|No| J[Redirect to login]
    G -->|Yes| K[Check application eligibility]
    F --> L[Show detailed distribution info]
    H --> M[Update distribution display]
    I --> M
    K --> N{Can apply?}
    N -->|No| O[Show application restrictions]
    N -->|Yes| P[Open application form]
    L --> Q[Show application option]
    M --> R[Distribution list updated]
    P --> S[Process application]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style S fill:#c8e6c9
    style J fill:#fff3e0
    style O fill:#fff3e0
```

## Distribution Search and Filter Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User searches distributions] --> B[Capture search input]
    B --> C[Apply search filters]
    C --> D{Filter type?}
    D -->|Text Search| E[Search by title/description]
    D -->|Date Filter| F[Filter by application deadline]
    D -->|Category Filter| G[Filter by distribution type]
    D -->|Status Filter| H[Filter by application status]
    D -->|Location Filter| I[Filter by distribution area]
    E --> J[Send search request]
    F --> J
    G --> J
    H --> J
    I --> J
    J --> K[GET /api/distributions/search]
    K --> L{Results found?}
    L -->|No| M[Show no results message]
    L -->|Yes| N[Display filtered distributions]
    M --> O[Suggest clearing filters]
    N --> P[Update distribution count]
    P --> Q[Show pagination if needed]
    Q --> R[Search results ready]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style O fill:#fff3e0
```

## Distribution Details Modal Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks distribution card] --> B[Open distribution details modal]
    B --> C[Fetch detailed distribution data]
    C --> D[GET /api/distributions/:id/details]
    D --> E{Data loaded?}
    E -->|No| F[Show loading spinner]
    E -->|Yes| G[Display distribution information]
    F --> H[Wait for data]
    G --> I[Show distribution title and description]
    I --> J[Display items/benefits included]
    J --> K[Show eligibility requirements]
    K --> L[Display application deadline]
    L --> M[Show distribution schedule]
    M --> N[Display available slots/quantities]
    N --> O[Show application process]
    O --> P[Display contact information]
    P --> Q[Show action buttons]
    Q --> R{User can apply?}
    R -->|No| S[Show application restrictions]
    R -->|Yes| T[Show apply button]
    H --> E

    style A fill:#e1f5fe
    style T fill:#c8e6c9
    style S fill:#fff3e0
```

## Application Process Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks Apply] --> B[Open application form]
    B --> C[Load user profile data]
    C --> D[Pre-fill personal information]
    D --> E[Show distribution-specific fields]
    E --> F[User fills application form]
    F --> G[User uploads required documents]
    G --> H[User confirms application details]
    H --> I[User agrees to terms and conditions]
    I --> J[User submits application]
    J --> K[Validate form data]
    K --> L{Form valid?}
    L -->|No| M[Show validation errors]
    L -->|Yes| N[Check application deadline]
    M --> F
    N --> O{Deadline passed?}
    O -->|Yes| P[Show deadline error]
    O -->|No| Q[Check available slots]
    P --> R[Suggest alternative distributions]
    Q --> S{Slots available?}
    S -->|No| T[Show waitlist option]
    S -->|Yes| U[Process application]
    T --> V[Add to waitlist]
    U --> W[POST /api/distributions/apply]
    V --> X[POST /api/distributions/waitlist]
    W --> Y{Application successful?}
    X --> Z{Waitlist successful?}
    Y -->|No| AA[Show application error]
    Y -->|Yes| BB[Show success message]
    Z -->|No| AA
    Z -->|Yes| CC[Show waitlist confirmation]
    AA --> J
    BB --> DD[Send confirmation email]
    CC --> EE[Send waitlist email]
    DD --> FF[Update application status]
    EE --> GG[Update waitlist status]
    FF --> HH[Close application form]
    GG --> HH
    HH --> II[Return to distribution list]

    style A fill:#e1f5fe
    style II fill:#c8e6c9
    style AA fill:#ffcdd2
    style R fill:#fff3e0
```

## Application Status Management Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User views distributions] --> B[Check user application status]
    B --> C[GET /api/distributions/my-applications]
    C --> D[Process application data]
    D --> E{User applied to distribution?}
    E -->|Not Applied| F[Show apply button]
    E -->|Applied| G[Show application status]
    E -->|Approved| H[Show approval status]
    E -->|Rejected| I[Show rejection status]
    E -->|Waitlisted| J[Show waitlist status]
    E -->|Distributed| K[Show distribution complete]
    F --> L[Enable application action]
    G --> M[Show pending review status]
    H --> N[Show pickup/distribution details]
    I --> O[Show rejection reason]
    J --> P[Show waitlist position]
    K --> Q[Show distribution confirmation]
    L --> R[User can apply]
    M --> S[User can check status]
    N --> T[User can schedule pickup]
    O --> U[User can reapply if allowed]
    P --> V[User can check waitlist updates]
    Q --> W[User can provide feedback]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style T fill:#c8e6c9
    style U fill:#fff3e0
    style V fill:#fff3e0
    style W fill:#c8e6c9
```

## Document Upload Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Application requires documents] --> B[Show upload interface]
    B --> C[User selects file]
    C --> D[Validate file type]
    D --> E{File valid?}
    E -->|No| F[Show file type error]
    E -->|Yes| G[Check file size]
    F --> C
    G --> H{Size acceptable?}
    H -->|No| I[Show file size error]
    H -->|Yes| J[Upload file]
    I --> C
    J --> K[POST /api/upload/document]
    K --> L{Upload successful?}
    L -->|No| M[Show upload error]
    L -->|Yes| N[Show upload success]
    M --> C
    N --> O[Add file to application]
    O --> P[Show file preview]
    P --> Q[Allow file removal]
    Q --> R[Document upload complete]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style F fill:#ffcdd2
    style I fill:#ffcdd2
    style M fill:#ffcdd2
```

## Distribution Schedule Management Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Application approved] --> B[Check distribution schedule]
    B --> C[GET /api/distributions/:id/schedule]
    C --> D[Display available time slots]
    D --> E[User selects preferred time]
    E --> F[User confirms selection]
    F --> G[POST /api/distributions/schedule]
    G --> H{Scheduling successful?}
    H -->|No| I[Show scheduling error]
    H -->|Yes| J[Send confirmation]
    I --> E
    J --> K[Add to calendar]
    K --> L[Send reminder notifications]
    L --> M[Schedule management complete]

    style A fill:#e1f5fe
    style M fill:#c8e6c9
    style I fill:#ffcdd2
```

## Mobile Distribution Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Mobile distribution page loads] --> B[Optimize layout for mobile]
    B --> C[Stack distribution cards vertically]
    C --> D[Adjust modal sizing]
    D --> E[Touch-optimize form controls]
    E --> F[Simplify file upload interface]
    F --> G[Enable camera capture for documents]
    G --> H[Responsive application forms]
    H --> I[Mobile-friendly confirmations]
    I --> J[Mobile distribution experience ready]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## Notification System Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Application event occurs] --> B{Event type?}
    B -->|Application Submitted| C[Send submission confirmation]
    B -->|Application Reviewed| D[Send review notification]
    B -->|Application Approved| E[Send approval notification]
    B -->|Application Rejected| F[Send rejection notice]
    B -->|Distribution Ready| G[Send pickup notification]
    B -->|Distribution Complete| H[Send completion confirmation]
    C --> I[Email with application details]
    D --> J[Email with review status]
    E --> K[Email with pickup instructions]
    F --> L[Email with rejection reason]
    G --> M[Email with pickup schedule]
    H --> N[Email with feedback request]
    I --> O[Update user dashboard]
    J --> O
    K --> O
    L --> O
    M --> O
    N --> O
    O --> P[Notification system complete]

    style A fill:#e1f5fe
    style P fill:#c8e6c9
```

## Off-Page Connectors

-   **From Client Landing**: A ⟵ [Client Landing Flow](client-landing-flow.md)
-   **From Admin Distribution Management**: B ⟵ [Distribution Management Flow](distribution-management-flow.md)
-   **To Authentication**: C ⟶ [Authentication Flow](authentication-flow.md)
-   **To User Profile**: D ⟶ [Settings Flow](settings-flow.md)
