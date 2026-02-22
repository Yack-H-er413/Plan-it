# Plan-it

Next.js (App Router) prerequisite-aware semester planner.

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
