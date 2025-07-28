# Seminar/Enrollment Flow - Farmer Connect

## Seminar Landing Page Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits /seminar] --> B[Load Seminar Component]
    B --> C[Load Client Navbar]
    C --> D[Check user authentication status]
    D --> E[Fetch available seminars]
    E --> F[GET /api/seminars/active]
    F --> G{Seminars loaded?}
    G -->|No| H[Show loading state]
    G -->|Yes| I[Display seminar cards]
    H --> J[Show skeleton loaders]
    I --> K[Show seminar details]
    K --> L[Display enrollment buttons]
    L --> M[User ready to browse seminars]
    J --> N[Wait for data load]
    N --> G

    style A fill:#e1f5fe
    style M fill:#c8e6c9
```

## Seminar Browsing Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User browses seminars] --> B[Display seminar grid]
    B --> C[Show seminar information cards]
    C --> D[User interacts with seminar]
    D --> E{User action?}
    E -->|View Details| F[Open seminar details modal]
    E -->|Enroll| G{User authenticated?}
    E -->|Search| H[Filter seminar list]
    E -->|Category Filter| I[Apply category filter]
    G -->|No| J[Redirect to login]
    G -->|Yes| K[Check enrollment eligibility]
    F --> L[Show detailed seminar info]
    H --> M[Update seminar display]
    I --> M
    K --> N{Can enroll?}
    N -->|No| O[Show enrollment restrictions]
    N -->|Yes| P[Open enrollment form]
    L --> Q[Show enrollment option]
    M --> R[Seminars list updated]
    P --> S[Process enrollment]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style S fill:#c8e6c9
    style J fill:#fff3e0
    style O fill:#fff3e0
```

## Seminar Search and Filter Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User searches seminars] --> B[Capture search input]
    B --> C[Apply search filters]
    C --> D{Filter type?}
    D -->|Text Search| E[Search by title/description]
    D -->|Date Filter| F[Filter by date range]
    D -->|Category Filter| G[Filter by seminar category]
    D -->|Status Filter| H[Filter by enrollment status]
    E --> I[Send search request]
    F --> I
    G --> I
    H --> I
    I --> J[GET /api/seminars/search]
    J --> K{Results found?}
    K -->|No| L[Show no results message]
    K -->|Yes| M[Display filtered seminars]
    L --> N[Suggest clearing filters]
    M --> O[Update seminar count]
    O --> P[Show pagination if needed]
    P --> Q[Search results ready]

    style A fill:#e1f5fe
    style Q fill:#c8e6c9
    style N fill:#fff3e0
```

## Seminar Details Modal Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks seminar card] --> B[Open seminar details modal]
    B --> C[Fetch detailed seminar data]
    C --> D[GET /api/seminars/:id/details]
    D --> E{Data loaded?}
    E -->|No| F[Show loading spinner]
    E -->|Yes| G[Display seminar information]
    F --> H[Wait for data]
    G --> I[Show seminar title and description]
    I --> J[Display schedule and duration]
    J --> K[Show instructor information]
    K --> L[Display location details]
    L --> M[Show enrollment requirements]
    M --> N[Display available slots]
    N --> O[Show enrollment deadline]
    O --> P[Display action buttons]
    P --> Q{User can enroll?}
    Q -->|No| R[Show enrollment restrictions]
    Q -->|Yes| S[Show enroll button]
    H --> E

    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style R fill:#fff3e0
```

## Enrollment Process Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks Enroll] --> B[Open enrollment form]
    B --> C[Load user profile data]
    C --> D[Pre-fill personal information]
    D --> E[Show additional required fields]
    E --> F[User fills enrollment form]
    F --> G[User selects preferences]
    G --> H[User agrees to terms]
    H --> I[User submits enrollment]
    I --> J[Validate form data]
    J --> K{Form valid?}
    K -->|No| L[Show validation errors]
    K -->|Yes| M[Check enrollment capacity]
    L --> F
    M --> N{Slots available?}
    N -->|No| O[Show waitlist option]
    N -->|Yes| P[Process enrollment]
    O --> Q[Add to waitlist]
    P --> R[POST /api/seminars/enroll]
    Q --> S[POST /api/seminars/waitlist]
    R --> T{Enrollment successful?}
    S --> U{Waitlist successful?}
    T -->|No| V[Show enrollment error]
    T -->|Yes| W[Show success message]
    U -->|No| V
    U -->|Yes| X[Show waitlist confirmation]
    V --> I
    W --> Y[Send confirmation email]
    X --> Z[Send waitlist email]
    Y --> AA[Update enrollment status]
    Z --> BB[Update waitlist status]
    AA --> CC[Close enrollment form]
    BB --> CC
    CC --> DD[Return to seminar list]

    style A fill:#e1f5fe
    style DD fill:#c8e6c9
    style V fill:#ffcdd2
```

## Enrollment Status Management Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User views seminars] --> B[Check user enrollment status]
    B --> C[GET /api/seminars/my-enrollments]
    C --> D[Process enrollment data]
    D --> E{User enrolled in seminar?}
    E -->|Not Enrolled| F[Show enroll button]
    E -->|Enrolled| G[Show enrolled status]
    E -->|Waitlisted| H[Show waitlist status]
    E -->|Completed| I[Show completed badge]
    F --> J[Enable enrollment action]
    G --> K[Show enrollment details]
    H --> L[Show waitlist position]
    I --> M[Show certificate option]
    J --> N[User can enroll]
    K --> O[User can cancel if allowed]
    L --> P[User can check status]
    M --> Q[User can download certificate]

    style A fill:#e1f5fe
    style N fill:#c8e6c9
    style O fill:#c8e6c9
    style P fill:#fff3e0
    style Q fill:#c8e6c9
```

## Seminar Calendar Integration Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Enrollment confirmed] --> B[Generate calendar event]
    B --> C[Create ICS file]
    C --> D[Include seminar details]
    D --> E[Set event reminders]
    E --> F[Add location information]
    F --> G[Include instructor contact]
    G --> H[Offer calendar download]
    H --> I[User downloads calendar event]
    I --> J[Add to personal calendar]
    J --> K[Set up notifications]
    K --> L[Calendar integration complete]

    style A fill:#e1f5fe
    style L fill:#c8e6c9
```

## Mobile Seminar Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Mobile seminar page loads] --> B[Optimize layout for mobile]
    B --> C[Stack seminar cards vertically]
    C --> D[Adjust modal sizing]
    D --> E[Touch-optimize form controls]
    E --> F[Simplify navigation]
    F --> G[Enable swipe gestures]
    G --> H[Responsive enrollment forms]
    H --> I[Mobile-friendly confirmations]
    I --> J[Mobile seminar experience ready]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## Notification System Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Enrollment event occurs] --> B{Event type?}
    B -->|Enrollment Confirmed| C[Send confirmation email]
    B -->|Waitlist Added| D[Send waitlist notification]
    B -->|Seminar Reminder| E[Send reminder notification]
    B -->|Seminar Cancelled| F[Send cancellation notice]
    B -->|Status Change| G[Send status update]
    C --> H[Email with seminar details]
    D --> I[Email with waitlist position]
    E --> J[Reminder with attendance info]
    F --> K[Cancellation with alternatives]
    G --> L[Status update details]
    H --> M[Update user dashboard]
    I --> M
    J --> M
    K --> M
    L --> M
    M --> N[Notification system complete]

    style A fill:#e1f5fe
    style N fill:#c8e6c9
```

## Off-Page Connectors

-   **From Client Landing**: A ⟵ [Client Landing Flow](client-landing-flow.md)
-   **From Admin Seminar Management**: B ⟵ [Seminar Management Flow](seminar-management-flow.md)
-   **To Authentication**: C ⟶ [Authentication Flow](authentication-flow.md)
-   **To User Profile**: D ⟶ [Settings Flow](settings-flow.md)
