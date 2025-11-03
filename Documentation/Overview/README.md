# Farmer Connect — System Overview

This guide gives a newcomer (human or LLM) a complete, skimmable picture of what Farmer Connect is, why it exists, how it works, and where to look in the code and docs for details.

> Audience: New developers, product/AI researchers (e.g., OpenAI ChatGPT 5 Research), and maintainers who need a fast mental model and deep links.

## TL;DR

- Purpose: A municipal-scale platform to connect farmers and administrators for inquiries, seminars, inventory/equipment distribution, surveys, analytics, and real‑time support.
- Users: Citizens/Farmers, Admin Staff, and Supervisors.
- Core flows: Authentication → Submit Inquiry → Real‑time triage & chat → Resolution → Survey → Analytics & Audit.
- Stack: React + Vite (client), Node.js/Express + Prisma + Socket.IO (server), JWT auth, Multer for uploads, email service, audit logging.
- Start here for details: System Flow, Features, Architecture, Data Model, Extending the System (links below).

## Table of Contents

1. [System Flow](./System_Flow.md)
2. [Features and Modules](./Features.md)
3. [Folder Structure](./Folder_Structure.md)
4. [Architecture](./Architecture.md)
5. [Data Model Summary](./Data_Model_Summary.md)
6. [Extending the System](./Extending_The_System.md)
6. Related docs in this repo:
   - Analytics API Endpoints: `Documentation/Analytics_API_Endpoints.md`
   - Inquiry Schema: `Documentation/Inquiry_System_Schema.md`
   - Stage Progression UI: `Documentation/Stage_Progression_UI_Guide.md`
   - Socket Guides: `Documentation/Socket_Integration_Guide.md`, `Documentation/Socket_Logout_Integration_Guide.md`
   - Mermaid Diagrams: `Documentation/MERMAID/*`

## Mental Model (High-level)

```mermaid
flowchart LR
  subgraph Client [Client (React/Vite)]
    UI[UI Components] --> Ctx[Contexts (Auth/Theme/Socket)]
  end

  subgraph Server [Server (Node/Express)]
    API[/REST APIs/] --> Svc[Services]
    Sockets[[Socket.IO]] --> Svc
    Svc --> DB[(Prisma ORM → DB)]
    Svc --> Mail[(Email)]
    Svc --> Files[(Uploads)]
    Svc --> Audit[(Audit Logger)]
  end

  Client <--> |REST & WebSocket| Server
```

## Personas and Key Journeys

- Farmer/Citizen: Registers → Logs in → Submits inquiry → Receives updates and chats in real‑time → Provides survey feedback.
- Admin: Monitors queues → Triages/assigns inquiries → Resolves with messages/attachments → Manages FAQs, seminars, and inventory → Reviews analytics and audit logs.
- Supervisor: Oversees analytics, audits, and system configuration.

## LLM-friendly Snapshot

```json
{
  "product_purpose": "Citizen-to-admin bridge for agriculture programs and support.",
  "core_modules": [
    "Authentication", "Inquiry", "Chat", "Survey", "Analytics", "Inventory", "Seminars", "FAQ", "Audit Logs", "Real-time Sockets"
  ],
  "primary_flows": ["inquiry_lifecycle", "seminar_registration", "inventory_request"],
  "tech_stack": {
    "client": "React + Vite + Tailwind + i18n",
    "server": "Node.js + Express + Prisma + Socket.IO",
    "auth": "JWT",
    "uploads": "Multer",
    "email": true,
    "audit_logging": true
  },
  "key_docs": {
    "system_flow": "./System_Flow.md",
    "features": "./Features.md",
    "architecture": "./Architecture.md",
    "data_model": "./Data_Model_Summary.md"
  }
}
```

Use the subpages for deep dives and code pointers.
