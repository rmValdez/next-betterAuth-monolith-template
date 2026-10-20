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

## Branching: Continuous Staging and On-Demand Main Synchronization

> This section takes precedence over any other branch or pull-request-target instruction in this file.
> `main` is this repository's production branch.

The development workflow is continuous and is not restricted to a daily schedule, a single task, or a fixed number of tasks.

- Before beginning a new development cycle, inspect the relationship between `main` and `staging` and synchronize them when necessary.
- All task branches must originate from the latest `staging`.
- Completed tasks must be submitted through PRs targeting `staging`.
- Developers may continue starting and completing additional tasks for as long as needed.
- Do not synchronize `staging` into `main` automatically after each task, after a fixed time interval, or simply because the day has ended.
- Synchronize `staging` into `main` only when the team explicitly decides that the accumulated changes are ready for delivery.
- Before synchronization, validate the combined changes and complete all required reviews and checks.
- Never merge unfinished or known-broken changes into `main`.
- After synchronization, verify the resulting branch state before continuing.
- **When a task is done, ask the user (the repository owner) whether it is all good.** The owner decides whether it merges and when `staging` is synchronized; an agent's own judgment is not approval.

**Workflow:** Establish baseline → Develop tasks → Merge completed tasks into staging → Continue working or synchronize to main when ready → Repeat.

`staging` is the continuous integration branch. `main` is updated on demand when the team chooses to deliver the accumulated changes.

```bash
# Start a task
git fetch origin
git log --oneline origin/main..origin/staging   # what staging has that main doesn't
git checkout staging && git pull
git checkout -b <type>/<short-description>      # feat/, fix/, docs/, test/, chore/ ...

# Finish a task: open a PR into staging (never into main)
gh pr create --base staging

# Deliver (only when the owner decides): one PR from staging into main
gh pr create --base main --head staging
```

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
