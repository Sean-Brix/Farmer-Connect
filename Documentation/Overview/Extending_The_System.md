# Extending the System

This guide shows where to add new features, how to integrate with cross‑cutting concerns, and how to keep changes LLM/maintainer-friendly.

## Contract for a New Feature

- Inputs: HTTP requests (and optional socket events), payload validation, auth roles.
- Outputs: Stored records, emitted events, emails/notifications, audit logs.
- Error Modes: Auth failures, validation errors, not found, quota/limits, file upload issues.
- Success Criteria: Endpoint returns 2xx with stable shape; corresponding UI renders; logs captured; tests and seeds updated if needed.

## Server (Node/Express)

1) Routing: add routes under `server/Router/API` (or existing domain folder); wire controllers.
2) Controller: create handlers in `server/Controller/<Domain>/`.
3) Service: put core logic in `server/Services/<domain>/` for reuse/testing.
4) Data: update Prisma schema and run migrations; add seeds in `server/prisma/Seeds/`.
5) Files: if needed, configure Multer in `server/Utils/multer_*.js`.
6) Realtime: define Socket.IO events under `server/Sockets/handlers/` and ensure auth.
7) Audit: log key actions via `server/Services/auditLogger.js`.
8) Internationalization: add server messages under `server/locales/` if applicable.

## Client (React/Vite)

1) Screens/Components: add under `client/src/Client/**` or `client/src/Admin/**`.
2) Shared UI: use `client/src/Components/**` for reusable widgets (Buttons, Cards, Chats, Survey).
3) Data Access: add fetchers under `client/src/Services/**`.
4) State: leverage contexts where needed (e.g., `SocketContext.jsx`, `ThemeContext.jsx`).
5) i18n: add strings under `client/src/locales/`.

## Sockets (Optional)

- Integrate events for real-time UX: define server handlers, emit on key transitions.
- Client: subscribe/emit in `SocketContext.jsx` or feature components.
- Follow `Documentation/Socket_Integration_Guide.md` and socket logout guidance.

## Testing & Seeds

- Add or extend quick scripts in `server/test-*.js` for happy-path verification.
- Update seeds (minimal fixtures) to unblock local testing.

## Analytics & Observability

- If the feature impacts KPIs, add endpoints under `Controller/Analytics` and document in `Documentation/Analytics_API_Endpoints.md`.
- Log via audit logger to enable future dashboards.

## LLM-Friendly Tips

- Name files/folders consistently with existing domains.
- Add a short module README with purpose and main routes.
- Use explicit headings and mermaid diagrams where helpful.
- Provide minimal JSON examples for inputs/outputs in docs.

### Example: Minimal Endpoint Shape

```json
{
  "POST /api/feature": {
    "request": {"field": "value"},
    "responses": {
      "201": {"id": "uuid", "status": "created"},
      "400": {"error": "validation_error"},
      "401": {"error": "unauthorized"}
    },
    "audit": ["feature_created"],
    "sockets": ["feature:new"]
  }
}
```
