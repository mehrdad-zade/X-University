import NextAuth from "next-auth";
import type { AppUser } from "./src/lib/userTypes";

declare module "next-auth" {
  interface Session {
    user?: Partial<AppUser>;
  }
  interface User extends Partial<AppUser> {}
}