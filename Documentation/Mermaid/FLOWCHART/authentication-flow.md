# Authentication Flow - Farmer Connect

## Login Process Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits /login] --> B[Check existing authentication]
    B --> C{Is authenticated?}
    C -->|Yes| D[Redirect to Dashboard/Landing]
    C -->|No| E[Display Login Form]
    E --> F[Load saved credentials if Remember Me was used]
    F --> G[User enters username/password]
    G --> H[User checks Remember Me option]
    H --> I[User clicks Login button]
    I --> J[Validate form inputs]
    J --> K{Inputs valid?}
    K -->|No| L[Show validation errors]
    L --> G
    K -->|Yes| M[Send POST to /auth/login]
    M --> N{Authentication successful?}
    N -->|No| O[Show error message]
    O --> G
    N -->|Yes| P[Save credentials if Remember Me checked]
    P --> Q[Set authentication cookies]
    Q --> R{User role?}
    R -->|Admin| S[Redirect to /admin dashboard]
    R -->|User| T[Redirect to / landing page]

    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style T fill:#c8e6c9
    style L fill:#ffcdd2
    style O fill:#ffcdd2
```

## Registration Process Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User visits /register] --> B[Display Registration Form]
    B --> C[User fills form fields]
    C --> D[User selects position dropdown]
    D --> E[User uploads profile picture optional]
    E --> F[User clicks Register button]
    F --> G[Validate all form inputs]
    G --> H{All inputs valid?}
    H -->|No| I[Show validation errors]
    I --> C
    H -->|Yes| J[Send POST to /auth/register]
    J --> K{Registration successful?}
    K -->|No| L{Error type?}
    L -->|Email exists| M[Show 'Email already exists' error]
    L -->|Username exists| N[Show 'Username already exists' error]
    L -->|Other error| O[Show general error message]
    M --> C
    N --> C
    O --> C
    K -->|Yes| P[Show success message]
    P --> Q[Auto redirect after 3 seconds]
    Q --> R[Navigate to /login]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style I fill:#ffcdd2
    style M fill:#ffcdd2
    style N fill:#ffcdd2
    style O fill:#ffcdd2
```

## Logout Process Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User clicks Logout button] --> B[Show confirmation modal]
    B --> C{User confirms logout?}
    C -->|No| D[Close modal, stay logged in]
    C -->|Yes| E[Send DELETE to /auth/logout]
    E --> F{Logout successful?}
    F -->|No| G[Log error but continue]
    F -->|Yes| H[Clear authentication cookies]
    G --> H
    H --> I[Clear localStorage]
    I --> J[Clear sessionStorage]
    J --> K[Navigate to /login]

    style A fill:#e1f5fe
    style K fill:#c8e6c9
    style D fill:#fff3e0
```

## Authentication State Management

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Component Mount] --> B[Check authentication status]
    B --> C[Send GET to /auth/is-authenticated]
    C --> D{Response successful?}
    D -->|No| E[Set as unauthenticated]
    D -->|Yes| F{User authenticated?}
    F -->|No| E
    F -->|Yes| G[Set user details]
    G --> H[Update UI state]
    E --> I[Show login options]
    H --> J[Show authenticated features]

    style A fill:#e1f5fe
    style I fill:#fff3e0
    style J fill:#c8e6c9
```

## Off-Page Connectors

-   **To Admin Dashboard**: A ⟶ [Admin Flow](admin-dashboard-flow.md)
-   **To Client Landing**: B ⟶ [Client Flow](client-landing-flow.md)
-   **To Settings**: C ⟶ [Settings Flow](settings-flow.md)
