import { useUser } from "@auth0/nextjs-auth0";

export function useAuth() {
  const { user, error, isLoading } = useUser();
  return { user, error, isLoading, isAuthenticated: !!user };
}