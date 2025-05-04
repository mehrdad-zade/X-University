import { useSession } from "next-auth/react";

export type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

export function useAuth() {
  const { data: session, status } = useSession();
  return {
    user: session?.user as SessionUser || null,
    error: null,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
  };
}