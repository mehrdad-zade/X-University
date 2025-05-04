"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { LOGIN_PATH } from "@/lib/useEndpoints";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type AdminUser = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const { user: sessionUser, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push(LOGIN_PATH);
      else if (sessionUser?.role !== 'admin') router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, sessionUser, router]);

  const { data: users, error } = useSWR(() => isAuthenticated && sessionUser?.role === 'admin' ? '/api/users' : null, fetcher);
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <ul className="space-y-2">
        {users?.map((u: AdminUser) => (
          <li key={u.id} className="border p-2 rounded">
            {u.email} — {u.role}
          </li>
        )) || <p>No users found</p>}
      </ul>
    </div>
  );
}