"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LOGIN_PATH } from "@/lib/useEndpoints";

export default function LoginPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(LOGIN_PATH);
  }, [router]);
  return <p>Redirecting to login...</p>;
}
