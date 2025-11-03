# Features and Modules

This page summarizes each functional area, why it exists, and how it’s wired.

> See also: Stage UI guides, socket guides, and analytics endpoints in the main `Documentation` folder.

## Authentication & Accounts

- Purpose: Secure access with role-based permissions (farmer/user, admin, supervisor).
- Client: `client/src/Authentication/**`
- Server: `server/Controller/Authentication/**`, `server/Middlewares/Auth/**`, `server/Utils/jwt_token.js`
- Notes: JWT-based auth; integrates with Socket.IO auth and logout flows.

## Inquiry Management

- Purpose: Core citizen support flow for reporting issues, asking questions, submitting documents/photos.
- Client: `client/src/Client/**`, shared components in `client/src/Components/**`
- Server: `server/Controller/Inquiry/**`, `server/Services/inquiry/**`, uploads under `server/Utils/multer_inquiry.js`
- Real-time: Socket events for new, assigned, status changes, and messages.
- Docs: `Documentation/Inquiry_System_Schema.md`, `Documentation/Stage_Progression_UI_Guide.md`

## Real-time Chat

- Purpose: Live conversation between user and admin within the context of an inquiry.
- Client: `client/src/Components/Chats/**`, `client/src/contexts/SocketContext.jsx`
- Server: `server/Sockets/handlers/**`
- Notes: Message persistence via API/DB; audit logging on message send/receive.

## Surveys & Feedback

- Purpose: Capture citizen satisfaction and resolution quality post-inquiry.
- Client: `client/src/Components/Survey/**`
- Server: `server/Controller/Survey_Forms/**`
- Analytics: Aggregated in admin dashboards.

## Analytics Dashboard

- Purpose: Operational and outcome metrics (volumes, SLA, satisfaction, attendance, inventory).
- Server: `server/Controller/Analytics/**`
- Docs: `Documentation/Analytics_API_Endpoints.md`

## Inventory & Distribution

- Purpose: Track equipment/agricultural inputs and distribution workflow.
- Server: `server/Controller/Inventory/**`, `server/Controller/Distribution/**`
- Client: Admin modules under `client/src/Admin/**`, user requests under `client/src/Client/**`
- Docs: `Documentation/MERMAID/Flowchart/inventory-*.mmd`

## Seminars & Attendance

- Purpose: Organize seminars, manage registration, and track attendance.
- Server: `server/Controller/Seminar/**`
- Client: Admin and user modules in respective folders
- Docs: `Documentation/MERMAID/Flowchart/seminar-*.mmd`

## FAQ Management

- Purpose: Curate categorized knowledge base for common questions.
- Server: `server/Controller/FAQ/**`
- Client: Shared components surface FAQs to users.

## Audit Logs

- Purpose: Trace critical actions (auth, status transitions, data changes, messaging) for governance.
- Server: `server/Services/auditLogger.js`, scripts `server/scripts/audit-enum-smoketest.js`

## Email Notifications

- Purpose: Notify users about status changes, seminar confirmations, survey invitations.
- Server: `server/Services/emailService.js`

## Internationalization (i18n)

- Purpose: Multi-language UX (currently `en`, `tl`).
- Client: `client/src/i18n.js`, locales in `client/src/locales/`
- Server: `server/i18n.js`, locales in `server/locales/`

## Admin Console

- Purpose: Operate the system—triage, assignments, approvals, content management, analytics.
- Client: `client/src/Admin/**` (styles, components, services)

---

### LLM-friendly Index

```json
{
  "modules": [
    {"name": "Authentication", "server": "Controller/Authentication", "client": "src/Authentication"},
    {"name": "Inquiry", "server": "Controller/Inquiry", "client": "src/Client"},
    {"name": "Chat", "server": "Sockets/handlers", "client": "src/contexts/SocketContext.jsx"},
    {"name": "Survey", "server": "Controller/Survey_Forms", "client": "src/Components/Survey"},
    {"name": "Analytics", "server": "Controller/Analytics"},
    {"name": "Inventory", "server": "Controller/Inventory"},
    {"name": "Distribution", "server": "Controller/Distribution"},
    {"name": "Seminars", "server": "Controller/Seminar"},
    {"name": "FAQ", "server": "Controller/FAQ"},
    {"name": "Audit Logs", "server": "Services/auditLogger.js"}
  ]
}
```
