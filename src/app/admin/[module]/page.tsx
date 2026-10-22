import { notFound } from "next/navigation";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
export const dynamic = "force-dynamic";
export default async function ModulePage({ params }: { params: Promise<{ module: string }> }) {
  const { module } = await params;
  if (!["servicios", "tecnicos", "garantias", "sedes"].includes(module)) notFound();
  return <AdminDashboard view={module as "servicios" | "tecnicos" | "garantias" | "sedes"}/>;
}
