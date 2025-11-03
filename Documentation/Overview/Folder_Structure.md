# Folder Structure and Purpose

This guide maps the repository layout with the purpose of each major folder and key files. Use it alongside Architecture.md for runtime context.

## Top-level

```
Farmer-Connect/
├─ client/                # React/Vite frontend
├─ server/                # Node/Express backend
├─ Documentation/         # System documentation, diagrams, tickets
├─ README.md              # Project-level readme
└─ SOCKET_INTEGRATION_GUIDE.md  # Socket integration notes
```

## Client (React/Vite)

Path: `client/`

```
client/
├─ index.html                  # App HTML entry
├─ package.json                # Frontend dependencies and scripts
├─ vite.config.js              # Vite config
├─ tailwind.config.js          # Tailwind configuration
├─ eslint.config.js            # Linting rules
├─ README.md                   # Frontend-specific notes
└─ src/
   ├─ main.jsx                 # React bootstrap
   ├─ App.jsx                  # Root application component
   ├─ index.css                # Global styles
   ├─ i18n.js                  # i18n setup (connects locales)
   ├─ contexts/
   │  ├─ SocketContext.jsx     # Socket.IO client connection and events
   │  └─ ThemeContext.jsx      # Theme management
   ├─ Authentication/          # Login/registration UX and assets
   │  ├─ Assets/
   │  └─ Components/
   ├─ Admin/                   # Admin console (management UIs)
   │  ├─ admin_style.css
   │  ├─ Assets/
   │  ├─ Components/           # Admin modules: analytics, users, inventory, etc.
   │  └─ Services/             # Admin-facing API wrappers
   ├─ Client/                  # Citizen-facing screens and services
   │  ├─ client_style.css
   │  ├─ Assets/
   │  ├─ Components/
   │  └─ Services/
   ├─ Components/              # Shared UI components
   │  ├─ Buttons/
   │  ├─ Cards/
   │  ├─ Chats/                # Chat widgets
   │  ├─ Common/               # Reusable UI primitives
   │  ├─ settings/
   │  └─ Survey/               # Survey forms/components
   ├─ Services/                # Shared client-side API calls
   ├─ locales/                 # Translations (e.g., en, tl)
   ├─ hooks/                   # Custom React hooks
   ├─ utils/                   # Utility helpers
   ├─ data/                    # Static/demo data
   ├─ DATING_GAWA/             # Experimental or legacy playground (rename/curate as needed)
   ├─ TEST/                    # Frontend test/dev pages or fixtures
   └─ Assets/                  # Images/icons for shared use
```

Purpose summary (client):
- `src/Admin/**`: Admin interfaces for triage, analytics, inventory, seminars, users, etc.
- `src/Client/**`: Citizen user flows (inquiries, requests, feedback).
- `src/Components/**`: Shared UI including Chats and Survey components.
- `src/contexts/**`: App-wide state (socket connection, theme).
- `src/Services/**`: API layer abstractions.
- `src/locales/**` + `src/i18n.js`: Internationalization resources and configuration.

## Server (Node/Express)

Path: `server/`

```
server/
├─ server.js                     # Main server entry (Express + Socket)
├─ minimal.js / basic-server.js  # Minimal/demo servers
├─ package.json                  # Backend dependencies and scripts
├─ config/
│  ├─ app.js                     # Express app configuration
│  └─ socket.js                  # Socket.IO setup and integration
├─ Router/
│  ├─ index.js                   # Composes API routers
│  ├─ API/                       # Domain routers (REST endpoints)
│  └─ Auth/                      # Auth-specific routing
├─ Controller/                   # Route handlers by domain
│  ├─ Account/
│  ├─ Analytics/                 # Analytics endpoints
│  ├─ Authentication/            # Login, register, token flows
│  ├─ Chat/
│  ├─ Distribution/
│  ├─ EIC/
│  ├─ FAQ/
│  ├─ Inquiry/
│  ├─ Inventory/
│  ├─ Logs/
│  ├─ SeedTrack/
│  ├─ Seminar/
│  ├─ Survey_Forms/
│  └─ VideoCall/
├─ Services/
│  ├─ auditLogger.js             # Central audit logging
│  ├─ botService.js
│  ├─ emailService.js            # Email notifications
│  ├─ socketLogoutService.js     # Socket-aware logout handling
│  └─ inquiry/                   # Inquiry business logic helpers
├─ Sockets/
│  ├─ handlers/                  # Socket.IO event handlers
│  ├─ middleware/                # Socket auth/middleware
│  └─ utils/                     # Socket utilities
├─ Middlewares/
│  ├─ Auth/                      # AuthN/AuthZ middleware
│  ├─ Error/                     # Error handling
│  └─ JWT/                       # JWT verification utilities
├─ prisma/
│  ├─ schema/                    # Prisma schema files
│  ├─ generated/                 # Generated Prisma client
│  ├─ Seeds/                     # Seed data modules
│  ├─ Data/                      # Static/fixture data
│  ├─ seed.js                    # Seed script
│  └─ seed-accounts-only.js      # Accounts-only seed
├─ models/
│  └─ inquiry/                   # Legacy or custom models (check migration to Prisma)
├─ scripts/
│  ├─ audit-enum-smoketest.js    # Audit enum validation
│  └─ check-seed.mjs             # Seed verification
├─ Utils/
│  ├─ jwt_token.js               # Token helpers
│  ├─ multer_inquiry.js          # Multer config for inquiry files
│  └─ multer_upload.js           # General upload config
├─ locales/
│  ├─ en/                        # Server-side localization
│  └─ tl/
├─ public/
│  ├─ uploads/                   # Uploaded files storage
│  └─ test-*.html                # Test/demo pages
├─ View/
│  ├─ index.html                 # Server-rendered landing/demo
│  └─ assets/                    # Static assets for views
└─ test-*.js                     # Endpoint/flow test scripts (manual smoke tests)
```

Purpose summary (server):
- `Controller/**`: Per-domain HTTP handlers.
- `Router/**`: Route composition and organization.
- `Services/**`: Business logic, audit logging, email, and domain helpers.
- `Sockets/**`: Real-time events and middleware.
- `Middlewares/**`: Request lifecycle concerns (auth, error, JWT).
- `prisma/**`: Data model, migrations, and seed data.
- `Utils/**`: Uploads and token helpers.
- `public/uploads/`: File storage for user/admin attachments.

## Documentation

Path: `Documentation/`

```
Documentation/
├─ Overview/                     # Newcomer-friendly overview hub
│  ├─ README.md                  # Entry point
│  ├─ System_Flow.md             # Key flows (mermaid sequences)
│  ├─ Features.md                # Module summaries
│  ├─ Architecture.md            # Stack and directories
│  ├─ Data_Model_Summary.md      # Entities and ER diagram
│  ├─ Extending_The_System.md    # How to add features
│  └─ Folder_Structure.md        # This file
├─ Analytics_API_Endpoints.md    # Analytics endpoints
├─ Inquiry_System_Schema.md      # Inquiry schema reference
├─ Stage_Progression_UI_Guide.md # UI states per stage
├─ Socket_Integration_Guide.md   # Socket usage guide
├─ Socket_Logout_Integration_Guide.md
└─ MERMAID/                      # Diagrams (DFD, ERD, flows, etc.)
```

## LLM-friendly map (condensed)

```json
{
  "client": {
    "contexts": "Socket and theme providers",
    "Admin": "Admin console UIs and services",
    "Client": "Citizen-facing UIs and services",
    "Components": "Shared UI (Buttons, Cards, Chats, Survey)",
    "Services": "HTTP client wrappers",
    "locales": "i18n translations"
  },
  "server": {
    "Controller": "Per-domain route handlers",
    "Router": "API/Auth routers",
    "Services": "Business logic and cross-cutting services",
    "Sockets": "Socket.IO handlers and middleware",
    "Middlewares": "Auth/error/JWT middlewares",
    "prisma": "DB schema/migrations/seeds",
    "Utils": "Multer uploads, JWT helpers",
    "public/uploads": "Uploaded assets"
  }
}
```
