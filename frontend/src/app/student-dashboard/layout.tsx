import { redirect } from "next/navigation";
import { currentUser } from "@/lib/security";

export default async function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();

  if (!user) {
    redirect("/login?next=/student-dashboard");
  }

  return children;
}
