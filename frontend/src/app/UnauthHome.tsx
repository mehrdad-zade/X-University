"use client";
import LoginButton from "../components/LoginButton";

export default function UnauthHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to X‑University</h1>
      <p className="mb-6">Learn, teach, and engage in modern education.</p>
      <LoginButton />
    </div>
  );
}