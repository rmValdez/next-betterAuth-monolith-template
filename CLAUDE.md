# Next.js Better Auth Monolith Template (next-betterAuth-monolith-template)

## Tech Stack & Architecture
- **Stack**: Next.js (App Router), Better Auth, Prisma ORM, PostgreSQL, Tailwind CSS, pnpm

### Key Commands
- **Install**: `pnpm install`
- **Dev**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint`
- **Prisma Generate**: `npx prisma generate`
- **Prisma Migrate**: `npx prisma migrate dev`

### Core Conventions
- Monolith architecture pairing Better Auth identity with application routes.
- Prisma schema owns database models; run migrations before runtime.
- Server Actions and Route Handlers must validate session via `auth.api.getSession`.

## Git & GitHub Pull Request Workflow

### 1. Inspect Before Editing
- Run `git status --short --branch`, `git branch --show-current`, and `git diff` before modifying files.
- Check for uncommitted changes and verify whether they belong to your task.
- Never discard, reset, clean, stash, or silently relocate existing uncommitted work without explicit authorization.

### 2. Dedicated Task Branches Are Mandatory
- Never implement changes or commit directly on `main`, `master`, or a protected/shared integration branch.
- Create or switch to a dedicated branch before making changes:
  - `feat/<short-description>` - new features
  - `fix/<short-description>` - bug fixes
  - `perf/<short-description>` - performance improvements
  - `refactor/<short-description>` - code refactoring
  - `docs/<short-description>` - documentation updates
  - `test/<short-description>` - test additions or fixes
  - `chore/<short-description>` - tooling and dependencies

### 3. Staging and Secret Safety
- Stage only intended files. Never use blind `git add .` or `git add -A` without inspecting `git diff --cached`.
- Never commit `.env`, credentials, tokens, secret keys, or local build/cache artifacts.
- Keep pull requests focused, cohesive, and limited to the requested scope.

### 4. Verification Before Declaring Readiness
- Always run the repository's verification checks (tests, linter, type-check) before claiming work is complete.
- Never claim tests passed or checks succeeded without running them and inspecting the output.

### 5. Conventional Commits
- Use standard conventional commit format: `<type>(<scope>): <imperative summary>`
- Examples:
  - `feat(auth): add session revocation endpoint`
  - `fix(routing): prevent race condition on route change`
  - `test(unit): add coverage for freshness classifier`

### 6. Mandatory Completion Report
At the end of every task or PR preparation, provide a structured completion report:
- **Branch**: Dedicated branch used.
- **Changes**: Bulleted summary of implemented changes.
- **Files**: Key files created, modified, or removed.
- **Verification**: Exact test, lint, and build commands executed and their results.
- **Git Status**: Clean working tree confirmation and commit hash if committed.
- **Risks & Follow-ups**: Any open caveats, skipped checks, or remaining tasks.
