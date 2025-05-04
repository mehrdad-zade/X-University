import NextAuth, { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { jwtDecode } from "jwt-decode";
import type { AppUser } from "../../../src/lib/userTypes";

// Ensure required env vars are present
const {
  OIDC_CLIENT_ID,
  OIDC_CLIENT_SECRET,
  OIDC_ISSUER,
} = process.env;

if (!OIDC_CLIENT_ID || !OIDC_ISSUER) {
  throw new Error("Missing OIDC_CLIENT_ID or OIDC_ISSUER in environment variables");
}

// Add server-side logs for troubleshooting
console.log("[NextAuth] API route loaded");

// KeycloakProvider config supports public (no secret) or confidential (with secret) clients
const keycloakProviderConfig = {
  clientId: OIDC_CLIENT_ID!,
  clientSecret: OIDC_CLIENT_SECRET || "",
  issuer: OIDC_ISSUER!,
};
console.log("[NextAuth] Initializing KeycloakProvider", keycloakProviderConfig);

export const authOptions: NextAuthOptions = {
  providers: [KeycloakProvider(keycloakProviderConfig)],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      console.log("[NextAuth] jwt callback", { hasAccount: !!account, hasProfile: !!profile });
      // Add Keycloak roles and user info to token
      if (account && account.access_token) {
        try {
          const decoded: any = jwtDecode(account.access_token as string);
          const clientRoles = decoded?.resource_access?.[OIDC_CLIENT_ID]?.roles;
          const realmRoles = decoded?.realm_access?.roles;
          let role: string | null | undefined = undefined;
          if (Array.isArray(clientRoles) && clientRoles.length > 0 && typeof clientRoles[0] === 'string') {
            role = clientRoles[0];
          } else if (Array.isArray(realmRoles) && realmRoles.length > 0 && typeof realmRoles[0] === 'string') {
            role = realmRoles[0];
          }
          // Assign all AppUser fields to token if available
          const userFields: Partial<AppUser> = {
            sub: decoded?.sub,
            name: decoded?.name || profile?.name,
            email: decoded?.email || profile?.email,
            role,
            language: decoded?.language,
            age_group: decoded?.age_group,
            picture: decoded?.picture || (profile as any)?.picture
          };
          Object.assign(token, userFields);
        } catch (e) {
          console.error('[NextAuth] JWT decode error:', e);
        }
      }
      return token;
    },
    async session({ session, token }) {
      console.log("[NextAuth] session callback", { user: session.user, token });
      // Assign all AppUser fields from token to session.user
      if (session.user) {
        const userFields: Partial<AppUser> = {
          sub: token.sub as string | undefined,
          name: token.name as string | undefined,
          email: token.email as string | undefined,
          role: token.role as string | undefined,
          language: token.language as string | undefined,
          age_group: token.age_group as string | undefined,
          picture: token.picture as string | undefined,
        };
        Object.assign(session.user, userFields);
        // Also set image for NextAuth compatibility
        if (token.picture) session.user.image = token.picture as string;
      }
      return session;
    },
  },
  // Optionally, add custom pages for sign in/out/error
  // pages: {
  //   signIn: '/auth/signin',
  //   error: '/auth/error',
  // },
  // Optionally, add events for logging
  // events: {
  //   signIn: async (message) => { /* ... */ },
  // },
  // Enable debug in development
  debug: process.env.NODE_ENV === 'development',
};

console.log("[NextAuth] Exporting API handler");
export default NextAuth(authOptions);
