"use client";
import { useEffect } from "react";
import { signIn } from "next-auth/react";

export default function LoginRedirect() {
  useEffect(() => {
    signIn(); // Redirects to NextAuth sign-in page
  }, []);
  return null;
}
