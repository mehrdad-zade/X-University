"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/useAuth";
import Link from "next/link";

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to X‑University</h1>
      <p className="mb-6">Learn, teach, and engage in modern education.</p>
      <Link href="/auth/login" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Login to Get Started
      </Link>
    </div>
  );
}
