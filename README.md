# Next.js Better Auth Monolith Template

A complete, production-ready skeletal authentication boilerplate built with **Next.js 15 (App Router)**, **Better Auth**, **Prisma ORM (PostgreSQL)**, and **Tailwind CSS**.

---

## ⚡ Features

- **Architecture & System Design**: Full technical specification with Mermaid diagrams documented in [ARCHITECTURE.md](./ARCHITECTURE.md).
- **Modern Authentication**: Powered by [Better Auth](https://better-auth.com) with credential registration, login, session tokens, and signout.
- **Database & ORM**: PostgreSQL paired with [Prisma](https://www.prisma.io/) schema for Users, Accounts, Sessions, and Verifications.
- **Protected Layouts**: Server-side session verification guard on `/dashboard` with auto-redirects, via a reusable `requireAuth()` helper that validates against the database rather than trusting cookie presence.
- **Validated Environment**: Zod-parsed environment variables with a client/server split, enforced at startup so misconfiguration fails loudly instead of silently degrading.
- **Client React Hook**: React Query powered `useAuthSession()` hook for reactive auth state and cache invalidation.
- **Landing Page**: Built-in modern cyberpunk/slate themed landing page showcasing features and direct CTA links.
- **Containerized DB**: Docker Compose configuration for immediate PostgreSQL local setup.
- **Default Seeder**: Built-in database seeding script configured with Better Auth's native password hasher (`better-auth/crypto`).

---

## 🚀 Quick Start

### 1. Start Database Container

```bash
docker compose up -d
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Configure Environment

```bash
cp .env.example .env
```

Then set a real `AUTH_SECRET` in `.env` — it must be at least 32 characters:

```bash
openssl rand -base64 32
```

Environment variables are validated on startup, so the app will refuse to build or
boot with a missing or too-short secret rather than falling back to an insecure default.

### 4. Apply Database Migrations

```bash
pnpm db:migrate
```

### 5. Seed Default Admin User

```bash
pnpm db:seed
```

Default credentials created:

- **Email**: `admin@example.com`
- **Password**: `password123`

> These are development-only credentials. Remove the seeded account before deploying.

### 6. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the landing page, or [http://localhost:3000/login](http://localhost:3000/login) to log into the dashboard.

---

## 📁 Project Structure

```
├── .env.example                # Environment variable template
├── .github/workflows/ci.yml    # Format, lint, type-check, build
├── docker-compose.yml          # Local PostgreSQL container service
├── prisma/
│   ├── migrations/             # Versioned schema history
│   ├── schema.prisma           # Better Auth identity schema
│   └── seed.ts                 # Default credential account seeder
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/  # Better Auth API catch-all handler
│   │   ├── dashboard/          # Protected dashboard routes (+ loading.tsx)
│   │   ├── login/              # Sign in / Sign up page
│   │   ├── error.tsx           # Root error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Base styling & glassmorphism
│   │   ├── layout.tsx          # Root layout with QueryProvider & Toaster
│   │   └── page.tsx            # Modern Landing Page
│   ├── components/
│   │   ├── auth/LoginForm.tsx  # Dynamic switchable Sign In / Sign Up form
│   │   └── ui/                 # Reusable UI primitives (Button, Card, Input)
│   ├── hooks/
│   │   └── useAuthSession.ts   # Session query hook
│   ├── lib/
│   │   ├── auth.ts             # Better Auth server configuration
│   │   ├── auth-client.ts      # Better Auth client configuration
│   │   ├── config.ts           # Validated client-safe environment
│   │   ├── config.server.ts    # Validated server-only secrets
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── session.ts          # requireAuth() / getCurrentSession()
│   │   └── utils.ts            # Helper utilities
│   └── providers/
│       └── query-provider.tsx  # TanStack Query Client Provider
```

---

## 📜 License

MIT
