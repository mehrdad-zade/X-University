"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

type AdminUser = {
  id: string;
  email: string;
  role: string;
};

export default function AdminPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) router.push('/auth/login');
      else if (user?.role !== 'admin') router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, user, router]);

  const { data: users, error } = useSWR(() => isAuthenticated && user?.role === 'admin' ? '/api/users' : null, fetcher);
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