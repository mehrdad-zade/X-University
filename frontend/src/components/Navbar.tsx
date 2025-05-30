"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import { LOGOUT_PATH } from "../lib/useEndpoints";
import LoginButton from "./LoginButton";

// Dynamically import LanguageSwitcher to ensure it only renders on the client
const LanguageSwitcher = dynamic(() => import("../app/LanguageSwitcher"), { ssr: false });

export default function Navbar() {
  const { isAuthenticated, user } = useAuth();
  return (
    <nav className="bg-white dark:bg-gray-900 px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">X‑University</Link>
      <div className="space-x-4 flex items-center">
        <Link href="/dashboard" className="hover:text-blue-500">Dashboard</Link>
        <Link href="/profile" className="hover:text-blue-500">Profile</Link>
        {/* Only show Admin link if user is authenticated and has admin role */}
        {isAuthenticated && user?.role === "admin" && (
          <Link href="/admin" className="hover:text-blue-500">Admin</Link>
        )}
        {/* Show user role if available */}
        {isAuthenticated && user?.role && (
          <span className="text-xs text-gray-500 border px-2 py-1 rounded bg-gray-100 ml-2">{user.role}</span>
        )}
        <LanguageSwitcher />
        {isAuthenticated ? (
          <Link href={LOGOUT_PATH} className="text-red-600">Logout</Link>
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}