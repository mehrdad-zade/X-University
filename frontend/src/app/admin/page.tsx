import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "admin") {
    redirect("/dashboard");
  }
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p>Welcome, admin user! Here you can manage the application.</p>
    </main>
  );
}