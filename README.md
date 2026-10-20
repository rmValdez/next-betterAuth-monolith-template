# Next.js Better Auth Monolith Template

A skeletal authentication starter built with **Next.js 15 (App Router)**, **Better Auth**, **Prisma ORM (PostgreSQL)**, and **Tailwind CSS**. It covers the core email/password lifecycle; it is a starting point, not a finished production auth system — see [Before deploying](#-before-deploying).

---

## ⚡ Features

- **Architecture & System Design**: Full technical specification with Mermaid diagrams documented in [ARCHITECTURE.md](./ARCHITECTURE.md).
- **Modern Authentication**: Powered by [Better Auth](https://better-auth.com) with credential registration, login, session tokens, and signout.
- **Email Verification**: New accounts must verify their email before they can sign in (`requireEmailVerification`). Sign-up shows a "check your email" state; unverified sign-in attempts offer a resend button.
- **Password Reset**: `/forgot-password` requests a one-hour reset link; `/reset-password` consumes it and sets a new password, revoking existing sessions.
- **Rate Limiting**: Better Auth's built-in limiter on `/api/auth/*`, with stricter rules for sign-in, sign-up, password reset, and verification resends.
- **Pluggable Email**: A small `sendEmail()` abstraction (`src/lib/email.ts`) that prints emails to the dev server console, with one obvious place to plug in a real provider.
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

## ✉️ Auth Flows & Dev-Mode Email

No email provider is bundled. With the default `EMAIL_TRANSPORT=console`, every email the
app sends is **printed to the terminal running `pnpm dev`**, including the link to click:

```
──────────────── [email: console transport] ────────────────
To:      jane@example.com
Subject: Verify your email address
...
http://localhost:3000/api/auth/verify-email?token=...&callbackURL=%2Femail-verified
```

| Flow            | Where it starts               | What happens                                                                                                                                                      |
| :-------------- | :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sign up         | `/login` → Sign Up tab        | Account is created without a session and a verification email is sent. The form switches to a "check your email" screen.                                          |
| Verify email    | Link in the email             | Better Auth marks the email verified, signs the user in, and redirects to `/email-verified`.                                                                      |
| Sign in         | `/login`                      | Unverified accounts are refused with a "Resend verification email" action. The seeded admin is pre-verified.                                                      |
| Forgot password | `/login` → "Forgot password?" | `/forgot-password` sends a reset link (the response is identical whether or not the account exists).                                                              |
| Reset password  | Link in the email             | Better Auth validates the token and redirects to `/reset-password?token=...`, where a new password is set. Links expire after 1 hour; other sessions are revoked. |

**Rate limits** (per IP, in-memory, enabled in all environments — see `rateLimit` in `src/lib/auth.ts`):
sign-in 5/min, sign-up 3/min, password-reset request 3 per 5 min, password-reset submit 5 per 5 min,
verification resend 3 per 5 min, and 100/min for everything else under `/api/auth`. Exceeding a limit returns HTTP 429.

---

## 🚧 Before Deploying

- **Configure a real email transport** in `src/lib/email.ts`. In production the console transport
  deliberately does not log links; it logs an error saying the email was not delivered, which means
  new users cannot verify and nobody can reset a password.
- **Rate-limit storage is per-process memory.** With multiple instances or serverless, switch
  `rateLimit.storage` to `"database"` (add Better Auth's `rateLimit` model) or `"secondary-storage"`
  (e.g. Redis). Behind a proxy, set `advanced.ipAddress` so the real client IP is used.
- **Remove the seeded admin account** and set a strong `AUTH_SECRET`.
- Not included: OAuth providers, 2FA, account deletion, email change, or automated tests.

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
│   │   ├── forgot-password/    # Request a password reset email
│   │   ├── reset-password/     # Set a new password from an emailed token
│   │   ├── email-verified/     # Landing page after the verification link
│   │   ├── error.tsx           # Root error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   ├── globals.css         # Base styling & glassmorphism
│   │   ├── layout.tsx          # Root layout with QueryProvider & Toaster
│   │   └── page.tsx            # Modern Landing Page
│   ├── components/
│   │   ├── auth/LoginForm.tsx  # Sign In / Sign Up form + "check your email" state
│   │   ├── auth/ForgotPasswordForm.tsx
│   │   ├── auth/ResetPasswordForm.tsx
│   │   └── ui/                 # Reusable UI primitives (Button, Card, Input)
│   ├── hooks/
│   │   └── useAuthSession.ts   # Session query hook
│   ├── lib/
│   │   ├── auth.ts             # Better Auth server configuration
│   │   ├── auth-client.ts      # Better Auth client configuration
│   │   ├── config.ts           # Validated client-safe environment
│   │   ├── config.server.ts    # Validated server-only secrets
│   │   ├── email.ts            # sendEmail() — console transport + provider extension point
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── session.ts          # requireAuth() / getCurrentSession()
│   │   └── utils.ts            # Helper utilities
│   └── providers/
│       └── query-provider.tsx  # TanStack Query Client Provider
```

---

## 📜 License

MIT
