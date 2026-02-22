import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Auth.js / NextAuth v5 configuration.
 *
 * Env vars (Auth.js inference):
 *  - AUTH_SECRET
 *  - AUTH_GOOGLE_ID
 *  - AUTH_GOOGLE_SECRET
 *
 * Google callback URL (local):
 *  - http://localhost:3000/api/auth/callback/google
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [Google],

  // Use our custom UI routes for sign-in.
  pages: {
    signIn: "/login",
  },

  // JWT sessions keep this app stateless (no database required).
  session: {
    strategy: "jwt",
  },
});
