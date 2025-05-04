"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import useSWR from 'swr';
import Image from "next/image";
import { LOGIN_PATH } from "@/lib/useEndpoints";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function ProfilePage() {
  const { user: isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const { data: swrUser, mutate } = useSWR(isAuthenticated ? '/api/users/me' : null, fetcher);
  const [form, setForm] = useState({ display_name: '', language: '', age_group: '' });
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(LOGIN_PATH);
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    setForm({
      display_name: swrUser?.name || '',
      language: swrUser?.language || '',
      age_group: swrUser?.age_group || ''
    });
  }, [swrUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to update profile");
      }
      setEditing(false);
      mutate(); // Refresh user data
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!swrUser) return null;

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <Image src={swrUser.picture || "/default-avatar.png"} alt="Avatar" className="w-24 h-24 rounded-full mb-4" width={96} height={96} />
      {editing ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="display_name" className="block mb-1">Display Name</label>
            <input
              id="display_name"
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="language" className="block mb-1">Preferred Language</label>
            <input
              id="language"
              name="language"
              value={form.language}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            />
          </div>
          <div>
            <label htmlFor="age_group" className="block mb-1">Age Group</label>
            <select
              id="age_group"
              name="age_group"
              value={form.age_group}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
              required
            >
              <option value="">Select...</option>
              <option value="child">Child</option>
              <option value="teen">Teen</option>
              <option value="adult">Adult</option>
            </select>
          </div>
          {error && <p className="text-red-600">{error}</p>}
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            className="ml-2 px-4 py-2 border rounded"
            onClick={() => setEditing(false)}
            disabled={submitting}
          >
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {swrUser.name}</p>
          <p><strong>Email:</strong> {swrUser.email}</p>
          <p><strong>Role:</strong> {swrUser.role || 'N/A'}</p>
          <p><strong>Language:</strong> {swrUser.language || 'N/A'}</p>
          <p><strong>Age Group:</strong> {swrUser.age_group || 'N/A'}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        </>
      )}
    </div>
  );
}