import "next-auth";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      /** Stable identifier used to scope browser storage per Google account. */
      planitUserKey?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    /** Stable identifier used to scope browser storage per Google account. */
    planitUserKey?: string;
  }
}
