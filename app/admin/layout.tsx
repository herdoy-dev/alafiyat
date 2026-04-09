import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/nav";
import { AdminSidebarWrapper } from "@/components/admin/sidebar-wrapper";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/");

  return (
    <div className="flex min-h-dvh bg-muted/30">
      <AdminSidebarWrapper />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminNav />
        <main className="flex-1 px-4 py-5 md:px-8 md:py-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
