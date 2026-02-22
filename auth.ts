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

  callbacks: {
    /**
     * Persist a stable, provider-specific identifier for client-side storage scoping.
     *
     * No database is used. The browser stores data locally, namespaced by this key.
     */
    async jwt({ token, account, profile }) {
      if (account?.provider === "google") {
        const sub = (profile as any)?.sub ?? (profile as any)?.id;
        if (sub) (token as any).planitUserKey = String(sub);
      }

      // Fallbacks (kept for resilience).
      if (!(token as any).planitUserKey) {
        (token as any).planitUserKey = token.sub ?? token.email;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).planitUserKey = (token as any).planitUserKey ?? token.sub ?? token.email;
      }
      return session;
    },
  },
});
