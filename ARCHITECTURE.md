# System Architecture & Technical Specification

`next-betterAuth-monolith-template` is a modular, production-ready monolithic template built with **Next.js 15 (App Router)**, **Better Auth**, and **Prisma ORM (PostgreSQL)**.

---

## 1. High-Level Architectural Diagram

```mermaid
graph TD
    Client["Browser / Client App"]

    subgraph NextJS["Next.js 15 Monolith (App Router)"]
        Landing["Landing Page (/)<br/>Server Component"]
        LoginUI["Auth View (/login)<br/>LoginForm (Client Component)"]
        DashboardUI["Dashboard (/dashboard)<br/>Protected Layout Guard"]

        subgraph AuthLayer["Better Auth Engine"]
            APIHandler["/api/auth/[...all]<br/>Next.js Route Handler"]
            AuthLib["Better Auth Core Engine<br/>src/lib/auth.ts"]
            AuthClient["Better Auth React Client<br/>src/lib/auth-client.ts"]
            UseSessionHook["useAuthSession Hook<br/>TanStack React Query Cache"]
        end

        subgraph DAL["Data Access Layer"]
            PrismaClient["Prisma Client Singleton<br/>src/lib/prisma.ts"]
        end
    end

    subgraph DataStore["Persistence & Container"]
        PostgresDB[("PostgreSQL 16 Database<br/>next_betterauth_db")]
    end

    %% Client Interactions
    Client -->|Public HTTP| Landing
    Client -->|Enter Auth| LoginUI
    Client -->|Authenticated Session| DashboardUI

    %% Auth Flows
    LoginUI -->|Invokes signIn/signUp| AuthClient
    DashboardUI -->|Verifies SSR Session| AuthLib
    AuthClient -->|HTTP /api/auth/*| APIHandler
    APIHandler --> AuthLib
    AuthLib -->|Adapter Queries| PrismaClient
    DashboardUI -->|React Query Hydration| UseSessionHook

    %% Persistence
    PrismaClient -->|Connection Pool| PostgresDB
```

---

## 2. Authentication Flow

### Sign Up / Registration

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant LoginForm as LoginForm.tsx
    participant AuthClient as authClient (Better Auth SDK)
    participant RouteHandler as /api/auth/[...all]
    participant AuthEngine as Better Auth Core (auth.ts)
    participant Prisma as Prisma Adapter
    participant DB as PostgreSQL

    User->>LoginForm: Enters Email & Password
    LoginForm->>AuthClient: authClient.signUp.email({ email, password, name })
    AuthClient->>RouteHandler: POST /api/auth/sign-up/email
    RouteHandler->>AuthEngine: Process Registration
    AuthEngine->>AuthEngine: Hash password using Better Auth scrypt hasher
    AuthEngine->>Prisma: Create User + Account records
    Prisma->>DB: INSERT into "users", "accounts"
    DB-->>Prisma: Confirm Rows Created
    AuthEngine->>AuthEngine: Issue signed Session Token
    AuthEngine-->>RouteHandler: Set HttpOnly Session Cookie
    RouteHandler-->>AuthClient: 200 OK (User + Session metadata)
    AuthClient-->>LoginForm: Success
    LoginForm->>User: Redirects to /dashboard
```

### Server-Side Route Protection (`/dashboard`)

```mermaid
sequenceDiagram
    autonumber
    actor User as User / Browser
    participant Layout as src/app/dashboard/layout.tsx
    participant AuthEngine as Better Auth Core
    participant DB as PostgreSQL

    User->>Layout: GET /dashboard
    Layout->>AuthEngine: auth.api.getSession({ headers: await headers() })
    AuthEngine->>DB: Verify Session Token & Expiration
    alt Valid Session
        DB-->>AuthEngine: Session & User Found
        AuthEngine-->>Layout: Session Object
        Layout-->>User: Render Protected Dashboard & Claims
    else Unauthenticated / Expired
        DB-->>AuthEngine: Null / Not Found
        AuthEngine-->>Layout: null
        Layout->>User: HTTP 307 Redirect -> /login
    end
```

---

## 3. Directory & File Breakdown

| Path                                | Purpose                                                                                            |
| :---------------------------------- | :------------------------------------------------------------------------------------------------- |
| `docker-compose.yml`                | Container definition for PostgreSQL 16 published on host port `5439` with volume persistence.      |
| `prisma/migrations/`                | Versioned SQL migration history; `pnpm db:migrate` is the supported path to a schema change.       |
| `prisma/schema.prisma`              | Source of truth for database models: `User`, `Account`, `Session`, and `Verification`.             |
| `prisma/seed.ts`                    | Database seeding script using `better-auth/crypto` scrypt hasher to provision `admin@example.com`. |
| `src/lib/config.ts`                 | Client-safe environment variables, parsed and validated with Zod at module load.                   |
| `src/lib/config.server.ts`          | Server-only secrets (`DATABASE_URL`, `AUTH_SECRET`), parsed with Zod; throws if invalid.           |
| `src/lib/session.ts`                | `requireAuth()` / `getCurrentSession()` — the reusable server-side session guard.                  |
| `src/lib/prisma.ts`                 | Global singleton instance for PrismaClient preventing hot-reload connection leaks.                 |
| `src/lib/auth.ts`                   | Core server configuration for Better Auth with Prisma PostgreSQL adapter.                          |
| `src/lib/auth-client.ts`            | Client SDK instance for React components (`signIn`, `signUp`, `signOut`, `useSession`).            |
| `src/hooks/useAuthSession.ts`       | React Query-backed session hook with 5-minute stale-time and cache invalidation.                   |
| `src/providers/query-provider.tsx`  | Global TanStack Query provider.                                                                    |
| `src/components/auth/LoginForm.tsx` | Client authentication component with tab switching, password peek, and validation.                 |
| `src/components/ui/`                | Primitive UI components (`Button.tsx`, `Card.tsx`, `Input.tsx`).                                   |
| `src/app/page.tsx`                  | Production-styled landing page featuring hero section, feature cards, and navigation.              |
| `src/app/login/page.tsx`            | Dedicated auth page wrapping `LoginForm`.                                                          |
| `src/app/dashboard/layout.tsx`      | Server component guard ensuring only authenticated sessions enter `/dashboard`.                    |
| `src/app/dashboard/page.tsx`        | Authenticated overview screen displaying session claims and active sign-out handler.               |
| `src/app/globals.css`               | Cyberpunk/slate design tokens, glassmorphism utilities, and gradient definitions.                  |

---

## 4. Database Schema Specification

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│              User               │       │             Account             │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id: String (cuid) [PK]          │◄──┐   │ id: String (cuid) [PK]          │
│ email: String [UNIQUE]          │   └───┤ userId: String [FK]             │
│ name: String?                   │       │ accountId: String               │
│ image: String?                  │       │ providerId: String              │
│ emailVerified: Boolean          │       │ password: String? (scrypt hash) │
│ createdAt: DateTime             │       │ accessToken: String?            │
│ updatedAt: DateTime             │       │ refreshToken: String?           │
└─────────────────────────────────┘       │ createdAt: DateTime             │
               │                          │ updatedAt: DateTime             │
               │                          └─────────────────────────────────┘
               │ 1:N
               ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│             Session             │       │          Verification           │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ id: String (cuid) [PK]          │       │ id: String (cuid) [PK]          │
│ token: String [UNIQUE]          │       │ identifier: String [INDEX]      │
│ userId: String [FK]             │       │ value: String                   │
│ expiresAt: DateTime             │       │ expiresAt: DateTime             │
│ ipAddress: String?              │       │ createdAt: DateTime             │
│ userAgent: String?              │       │ updatedAt: DateTime             │
│ createdAt: DateTime             │       └─────────────────────────────────┘
│ updatedAt: DateTime             │
└─────────────────────────────────┘
```

---

## 5. Security & Best Practices Implemented

1. **Native Cryptographic Password Hashing**: Passwords are never stored in plaintext and are hashed using Better Auth's internal scrypt implementation (`better-auth/crypto`), ensuring zero compatibility issues across login and seed routines.
2. **Server-Side Session Guarding**: `src/app/dashboard/layout.tsx` calls `requireAuth()` from `src/lib/session.ts`, which verifies the session against the database — not merely the presence of a cookie — before emitting HTML, mitigating client-side flash-of-unauthenticated-content (FOUC). New protected routes should call the same helper rather than re-implementing the check.
3. **Reactive Query Invalidation**: Client-side auth mutations invalidate TanStack React Query keys (`["auth", "session"]`), updating the UI state immediately without hard page reloads.
4. **Environment Isolation**: Server-only secrets (`DATABASE_URL`, `AUTH_SECRET`) live in `config.server.ts`, which is never imported by a client component, keeping them out of the browser bundle. Both that module and the client-safe `config.ts` parse their variables through Zod at import time, so an absent or too-short `AUTH_SECRET` aborts the build instead of silently falling back to Better Auth's development default.
5. **Aligned Password Policy**: `MIN_PASSWORD_LENGTH` in `config.ts` is consumed by both the Better Auth server config and the sign-up form, so client-side validation cannot drift from the server's floor.
