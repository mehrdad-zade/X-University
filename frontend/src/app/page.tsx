import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";
import { redirect } from "next/navigation";
import UnauthHome from "./UnauthHome";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "admin") {
    redirect("/admin");
  } else if (session?.user?.role === "student" || session?.user?.role === "teacher") {
    redirect("/dashboard");
  }
  return <UnauthHome />;
}
