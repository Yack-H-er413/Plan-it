# Plan-it

Next.js (App Router) prerequisite-aware semester planner.

## Storage model (no database)

Plan-it stores planner data in the browser.

* **Not signed in:** data is saved under a local profile in `localStorage`.
* **Signed in with Google:** data is saved under a Google-account namespace in `localStorage` (so switching accounts switches workspaces on that device).

There is no server-side database and no Google Drive integration.

## Development

```bash
npm install
npm run dev
```

## Google Sign-in (Auth.js / NextAuth v5)

1. Copy env template and fill values:

```bash
cp .env.example .env.local
```

2. Create a Google OAuth client in Google Cloud Console.

Recommended local settings:

* **Authorized JavaScript origins**: `http://localhost:3000`
* **Authorized redirect URI**: `http://localhost:3000/api/auth/callback/google`

3. Set these in `.env.local`:

* `AUTH_SECRET` (generate with `npx auth secret`)
* `AUTH_GOOGLE_ID`
* `AUTH_GOOGLE_SECRET`

Then run `npm run dev` and use **Log in / Sign up → Continue with Google**.
