# Architecture

This page describes the technical architecture, key directories, and cross-cutting concerns. For a comprehensive tree view and per-folder purposes, see [Folder Structure](./Folder_Structure.md).

## Stack

- Client: React + Vite, Tailwind CSS, i18n (`client/`)
- Server: Node.js + Express, Prisma ORM, Socket.IO, Multer uploads, JWT auth (`server/`)
- Storage: Relational DB via Prisma (see `server/prisma/**`)
- Assets/Uploads: `server/public/uploads/`

## Runtime Topology

```mermaid
flowchart TB
  UI[React UI] -- REST --> API[Express Router]
  UI == WebSocket == WS[Socket.IO]
  API --> CTRL[Controllers]
  CTRL --> SVC[Services]
  SVC --> PRISMA[(Prisma/DB)]
  SVC --> AUDIT[(Audit Logger)]
  SVC --> EMAIL[(Email Service)]
  SVC --> UPLOADS[(Multer Uploads)]
```

## Key Directories (Server)

- `server/Router/**` — Route definitions (REST endpoints)
- `server/Controller/**` — Request handlers organized by domain (Inquiry, Auth, Analytics, etc.)
- `server/Services/**` — Reusable business logic (auditLogger, emailService, domain services)
- `server/Sockets/**` — Socket.IO handlers, middleware, and utilities
- `server/Middlewares/**` — Auth/JWT/error handling
- `server/prisma/**` — Schema, migrations, seed scripts (`seed.js`, `seed-accounts-only.js`)
- `server/config/**` — App/socket config (`app.js`, `socket.js`)
- `server/Utils/**` — Upload configuration (multer), tokens
- `server/public/**` — Static files and uploads

## Key Directories (Client)

- `client/src/Admin/**` — Admin console (styles, components, services)
- `client/src/Client/**` — Citizen-facing features
- `client/src/Components/**` — Shared UI (Buttons, Cards, Chats, Survey, Common)
- `client/src/contexts/**` — React Context (Socket, Theme)
- `client/src/Services/**` — Client-side API wrappers
- `client/src/locales/**` — i18n resources

## Authentication

- JWT-based: tokens issued on login; attached to API requests and Socket.IO auth.
- Middleware enforces access across routes; logout events handled via socket logout integration.

## Real-time via Socket.IO

- Events for inquiry lifecycle, chat messages, and presence.
- Integration points: `server/config/socket.js`, handlers under `server/Sockets/handlers/**`.
- Client usage: `client/src/contexts/SocketContext.jsx`.

## Files/Uploads

- Handled via Multer (`server/Utils/multer_inquiry.js`, `server/Utils/multer_upload.js`).
- Stored in `server/public/uploads/`; referenced by domain records (e.g., inquiry attachments).

## Audit Logging

- Centralized utility: `server/Services/auditLogger.js`.
- Recommended use: log security-sensitive and workflow transition events.

## Internationalization (i18n)

- Client and server localization under `client/src/locales/` and `server/locales/` with glue code `client/src/i18n.js`, `server/i18n.js`.

## Configuration

- App and socket configs: `server/config/app.js`, `server/config/socket.js`.
- Environment variables (not listed here for security): standard Node `.env` conventions; see server startup scripts for usage.

## Testing and Utilities

- Server-side test scripts: files like `server/test-*.js` for endpoints and flows.
- Seed and verification utilities: `server/scripts/*.js`, `server/prisma/seed*.js`.
