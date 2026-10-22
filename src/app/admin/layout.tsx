import { AdminSidebar } from "@/components/admin/admin-sidebar";
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (<div className="flex min-h-screen flex-col bg-slate-50 md:flex-row"><AdminSidebar /><main className="flex-1 p-6">{children}</main></div>);
}
