"use client";

import { AdminSidebar } from "./sidebar";

export function AdminSidebarWrapper() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-sidebar-border md:block">
      <AdminSidebar />
    </aside>
  );
}
