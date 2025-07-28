# Settings and Profile Management Flow - Farmer Connect

## Settings Page Access Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User navigates to settings] --> B{Authentication required?}
    B -->|No| C[Redirect to login]
    B -->|Yes| D[Load Settings Page]
    C --> E ⟶ [Authentication Flow](authentication-flow.md)
    D --> F[Check user permissions]
    F --> G[Load user profile data]
    G --> H[GET /api/account/details/me]
    H --> I{Data loaded successfully?}
    I -->|No| J[Show loading error]
    I -->|Yes| K[Display settings navigation]
    J --> L[Show retry option]
    K --> M[Show settings categories]
    L --> H
    M --> N[User ready to manage settings]

    style A fill:#e1f5fe
    style N fill:#c8e6c9
    style C fill:#fff3e0
    style J fill:#ffcdd2
```

## Profile Settings Navigation Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Settings page loaded] --> B[Display settings menu]
    B --> C{User selects category?}
    C -->|Profile Information| D[Load profile editor]
    C -->|Account Security| E[Load account settings]
    C -->|Picture Management| F[Load picture upload]
    C -->|Notification Preferences| G[Load notification settings]
    C -->|Privacy Settings| H[Load privacy controls]
    C -->|Application History| I[Load user applications]
    D --> J[Show profile form]
    E --> K[Show security options]
    F --> L[Show picture upload interface]
    G --> M[Show notification toggles]
    H --> N[Show privacy controls]
    I --> O[Show application history]
    J --> P[Profile editing ready]
    K --> Q[Security settings ready]
    L --> R[Picture management ready]
    M --> S[Notification settings ready]
    N --> T[Privacy settings ready]
    O --> U[History viewing ready]

    style A fill:#e1f5fe
    style P fill:#c8e6c9
    style Q fill:#c8e6c9
    style R fill:#c8e6c9
    style S fill:#c8e6c9
    style T fill:#c8e6c9
    style U fill:#c8e6c9
```

## Profile Information Edit Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User edits profile] --> B[Load current profile data]
    B --> C[Pre-fill form fields]
    C --> D[User modifies information]
    D --> E[User changes username]
    E --> F[User updates position]
    F --> G[User modifies contact info]
    G --> H[User clicks Save Changes]
    H --> I[Validate form data]
    I --> J{All fields valid?}
    J -->|No| K[Show validation errors]
    J -->|Yes| L[Check username availability]
    K --> D
    L --> M{Username available?}
    M -->|No| N[Show username taken error]
    M -->|Yes| O[Send update request]
    N --> E
    O --> P[PUT /api/account/details/me]
    P --> Q{Update successful?}
    Q -->|No| R[Show update error]
    Q -->|Yes| S[Show success message]
    R --> H
    S --> T[Update local profile state]
    T --> U[Refresh UI components]
    U --> V[Profile update complete]

    style A fill:#e1f5fe
    style V fill:#c8e6c9
    style K fill:#ffcdd2
    style N fill:#ffcdd2
    style R fill:#ffcdd2
```

## Profile Picture Management Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User manages profile picture] --> B[Display current picture]
    B --> C[Show upload options]
    C --> D{User action?}
    D -->|Upload New| E[Open file picker]
    D -->|Take Photo| F[Open camera interface]
    D -->|Remove Picture| G[Confirm removal]
    E --> H[User selects image file]
    F --> I[User takes photo]
    G --> J[User confirms removal]
    H --> K[Validate image file]
    I --> K
    J --> L[DELETE /api/account/picture/me]
    K --> M{File valid?}
    M -->|No| N[Show file error]
    M -->|Yes| O[Preview image]
    N --> C
    O --> P[User confirms upload]
    P --> Q[POST /api/account/picture/me]
    L --> R{Removal successful?}
    Q --> S{Upload successful?}
    R -->|No| T[Show removal error]
    R -->|Yes| U[Clear picture display]
    S -->|No| V[Show upload error]
    S -->|Yes| W[Display new picture]
    T --> G
    U --> X[Picture removed successfully]
    V --> P
    W --> Y[Picture updated successfully]
    X --> Z[Profile picture management complete]
    Y --> Z

    style A fill:#e1f5fe
    style Z fill:#c8e6c9
    style N fill:#ffcdd2
    style T fill:#ffcdd2
    style V fill:#ffcdd2
```

## Account Security Settings Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User accesses security settings] --> B[Display security options]
    B --> C{User action?}
    C -->|Change Password| D[Open password change form]
    C -->|Two-Factor Auth| E[Configure 2FA settings]
    C -->|Session Management| F[Show active sessions]
    C -->|Login History| G[Display login logs]
    D --> H[User enters current password]
    H --> I[User enters new password]
    I --> J[User confirms new password]
    J --> K[Validate password requirements]
    K --> L{Password valid?}
    L -->|No| M[Show password requirements]
    L -->|Yes| N[POST /api/account/password]
    M --> I
    N --> O{Password changed?}
    O -->|No| P[Show change error]
    O -->|Yes| Q[Show success message]
    P --> H
    Q --> R[Force re-authentication]
    R --> S[Security update complete]

    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style M fill:#ffcdd2
    style P fill:#ffcdd2
```

## Notification Preferences Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User manages notifications] --> B[Load current preferences]
    B --> C[GET /api/account/notifications]
    C --> D[Display notification categories]
    D --> E[Show toggle switches]
    E --> F{User modifies settings?}
    F -->|Email Notifications| G[Toggle email preferences]
    F -->|SMS Notifications| H[Toggle SMS preferences]
    F -->|Push Notifications| I[Toggle push preferences]
    F -->|Seminar Reminders| J[Toggle seminar notifications]
    F -->|Distribution Updates| K[Toggle distribution notifications]
    G --> L[Update preference state]
    H --> L
    I --> L
    J --> L
    K --> L
    L --> M[User saves preferences]
    M --> N[PUT /api/account/notifications]
    N --> O{Update successful?}
    O -->|No| P[Show update error]
    O -->|Yes| Q[Show success message]
    P --> M
    Q --> R[Notification preferences updated]

    style A fill:#e1f5fe
    style R fill:#c8e6c9
    style P fill:#ffcdd2
```

## Privacy Settings Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User manages privacy] --> B[Load privacy settings]
    B --> C[Display privacy options]
    C --> D{User modifies settings?}
    D -->|Profile Visibility| E[Set profile visibility]
    D -->|Data Sharing| F[Configure data sharing]
    D -->|Contact Preferences| G[Set contact preferences]
    D -->|Activity Tracking| H[Configure tracking settings]
    E --> I[Update visibility setting]
    F --> J[Update sharing preferences]
    G --> K[Update contact settings]
    H --> L[Update tracking preferences]
    I --> M[Validate privacy choices]
    J --> M
    K --> M
    L --> M
    M --> N[User saves privacy settings]
    N --> O[PUT /api/account/privacy]
    O --> P{Update successful?}
    P -->|No| Q[Show update error]
    P -->|Yes| R[Show success confirmation]
    Q --> N
    R --> S[Privacy settings updated]

    style A fill:#e1f5fe
    style S fill:#c8e6c9
    style Q fill:#ffcdd2
```

## Application History Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User views application history] --> B[Fetch user applications]
    B --> C[GET /api/account/applications]
    C --> D{Data loaded?}
    D -->|No| E[Show loading error]
    D -->|Yes| F[Process application data]
    E --> G[Show retry option]
    F --> H[Group applications by type]
    H --> I[Display seminar applications]
    I --> J[Display EIC requests]
    J --> K[Display distribution applications]
    K --> L[Show application status]
    L --> M[Add filtering options]
    M --> N[Add sorting options]
    N --> O{User interacts?}
    O -->|Filter| P[Apply status filter]
    O -->|Sort| Q[Apply sorting]
    O -->|View Details| R[Show application details]
    P --> S[Update display]
    Q --> S
    R --> T[Display detailed information]
    S --> U[Application history ready]
    T --> V[Detail view ready]
    G --> B

    style A fill:#e1f5fe
    style U fill:#c8e6c9
    style V fill:#c8e6c9
    style E fill:#ffcdd2
```

## Mobile Settings Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[Mobile settings loads] --> B[Optimize layout for mobile]
    B --> C[Stack settings vertically]
    C --> D[Touch-optimize form controls]
    D --> E[Simplify navigation]
    E --> F[Adjust modal sizing]
    F --> G[Enable swipe gestures]
    G --> H[Responsive form layouts]
    H --> I[Mobile-friendly file uploads]
    I --> J[Mobile settings experience ready]

    style A fill:#e1f5fe
    style J fill:#c8e6c9
```

## Settings Validation Flow

```mermaid
%%{init: {'flowchart': {'curve': 'linear'}}}%%
flowchart TD
    A[User submits settings] --> B[Client-side validation]
    B --> C{Data valid?}
    C -->|No| D[Show validation errors]
    C -->|Yes| E[Send to server]
    D --> F[Highlight error fields]
    E --> G[Server-side validation]
    G --> H{Server validation passed?}
    H -->|No| I[Return validation errors]
    H -->|Yes| J[Process update]
    I --> K[Display server errors]
    J --> L[Update database]
    L --> M[Return success response]
    F --> N[User corrects errors]
    K --> O[User corrects errors]
    M --> P[Update UI state]
    N --> A
    O --> A
    P --> Q[Settings validation complete]

    style A fill:#e1f5fe
    style Q fill:#c8e6c9
    style D fill:#ffcdd2
    style I fill:#ffcdd2
```

## Off-Page Connectors

-   **From Client Landing**: A ⟵ [Client Landing Flow](client-landing-flow.md)
-   **From Admin Dashboard**: B ⟵ [Admin Dashboard Flow](admin-dashboard-flow.md)
-   **To Authentication**: C ⟶ [Authentication Flow](authentication-flow.md)
-   **From Seminar Page**: D ⟵ [Seminar Flow](seminar-flow.md)
-   **From EIC Page**: E ⟵ [EIC Flow](eic-flow.md)
-   **From Distribution Page**: F ⟵ [Distribution Flow](distribution-flow.md)
