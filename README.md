<div align="center">
  <img src="public/planit-logo.png" alt="Plan-it logo" width="110" />
  <h1>Plan-it</h1>
  <p><strong>Prerequisite-aware course planner built with Next.js, TypeScript, and Auth.js.</strong></p>
  <p>
    Plan smarter. Graduate faster. Mapping your degree, one class at a time.
  </br></br>Try it out: https://plan-it-planner.vercel.app
  </p>
</div>

## Why Plan-it

Most degree planners are either static spreadsheets or rigid school-specific tools. Plan-it takes a more general product approach:

- works for **any school** because courses are user-defined
- supports **guest usage** with no account required
- enforces **prerequisite ordering** during planning
- stores plans in **scoped local browser storage**
- supports **share/import** through a self-contained URL payload

## Core features

- **Multi-workspace planning**
  - create, rename, duplicate, and delete independent plans
  - separate guest and signed-in workspace namespaces
- **Course library management**
  - add custom courses with code, title, credits, notes, and prerequisites
  - quick-add prerequisites from existing courses
- **Prerequisite-aware scheduling**
  - blocks invalid placements if prerequisites are missing
  - blocks placing a class in the **same term** as one of its prerequisites
  - prevents duplicate placement of the same course across the plan
- **Progress tracking**
  - mark terms as completed
  - track earned credits vs. total credits vs. graduation goal
- **Share / import workflow**
  - compresses planner state into a URL-safe token
  - lets another user import the full plan in one step
- **Authentication + persistence**
  - works without login
  - optional Google OAuth via Auth.js / NextAuth v5
  - browser storage is namespaced by provider and Google user ID
- **Migration handling**
  - migrates legacy unscoped local storage into the new scoped workspace model
  - performs one-time claim of local guest data into a signed-in Google namespace

## Technical highlights

### 1) Constraint validation in the planner
The planner is not a static board. It contains placement rules that evaluate the target term before a course is added.

Validation checks include:

- target term exists
- course is not already scheduled elsewhere
- all prerequisites appear in **earlier** terms
- same-term prerequisite placement is rejected with a specific user-facing explanation

That moves the project from simple CRUD UI into rule-driven interaction design.

### 2) Shareable state without a backend database
Plan-it encodes the full planner state into a compressed token using an LZ-string implementation and places it in the URL query string.

Benefits:

- no server-side persistence required for sharing
- easy import/export semantics
- deterministic, portable planner state

This is a strong example of reducing infrastructure complexity through data representation.

### 3) Scoped client-side persistence
Workspace state is stored in `localStorage`, but not under one flat key. The app namespaces storage by:

- guest mode: `planit::local::...`
- signed-in mode: `planit::google::<user>::...`

This avoids cross-account collisions on shared devices and makes auth-aware storage behavior explicit.

### 4) Stateless auth architecture
Auth is implemented with **Auth.js / NextAuth v5** using **JWT sessions**, which keeps the app stateless and removes the need for a database for session persistence.

### 5) UX-oriented frontend implementation
The app includes:

- responsive Next.js App Router pages
- reusable UI primitives
- animated transitions with Motion
- modal-driven workflows for course creation, placement, deletion, reset, and sharing
- dark/light theme toggle

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Auth | Auth.js / NextAuth v5 beta, Google OAuth |
| Animation | Motion |
| Icons | Lucide React |
| Persistence | localStorage + URL-encoded compressed state |
| Analytics | Vercel Analytics, Vercel Speed Insights |

## Architecture overview

```text
app/
  page.tsx                 -> landing page
  workspaces/page.tsx      -> workspace management
  planner/[id]/page.tsx    -> main planner experience
  login + signup           -> auth entry points
  admin/page.tsx           -> admin/sandbox flow

components/
  layout/                  -> shells, nav, top-level structure
  planner/                 -> planner UI and term/course interactions
  modals/                  -> add/place/share/confirm workflows
  workspaces/              -> scoped workspace persistence logic
  share/                   -> URL encode/decode + compression
  auth/                    -> auth provider + sign-in UI
  ui/                      -> reusable primitive components
```

## Local setup

### 1) Requirements

- Node.js **24.x**
- npm **10+**

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment variables

Copy the example env file:

```bash
cp .env.example .env.local
```

Populate the following values if you want Google sign-in enabled:

```env
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_TRUST_HOST=true
```

> The planner still works in guest mode without auth.

### 4) Run the app

```bash
npm run dev
```

Then open `http://localhost:3000`.

## Example user flows

### Guest flow
1. Open the app and create a workspace.
2. Add courses and prerequisites.
3. Add terms and place courses into valid semesters.
4. Share the plan by copying a generated link.

### Signed-in flow
1. Sign in with Google.
2. Use a Google-scoped workspace namespace.
3. Continue editing plans on that signed-in browser profile.

## Future improvements

- database-backed sync across devices
- formal drag-and-drop library support
- prerequisite graph visualization
- schedule recommendations / conflict detection
- test coverage for planner validation and storage migrations
- institutional templates for more schools

## License

MIT
