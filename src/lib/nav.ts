import { LayoutDashboard, CalendarDays, HardHat, ShieldCheck, MapPin } from "lucide-react";
export const publicNav = [
  { label: "Inicio", href: "/" }, { label: "Servicios", href: "/servicios" },
  { label: "Bogotá", href: "/sedes/bogota" }, { label: "Cali", href: "/sedes/cali" },
  { label: "Contacto", href: "/contacto" },
];
export const adminNav = [
  { label: "Resumen", href: "/admin", icon: LayoutDashboard },
  { label: "Agenda y servicios", href: "/admin/servicios", icon: CalendarDays },
  { label: "Técnicos", href: "/admin/tecnicos", icon: HardHat },
  { label: "Garantías", href: "/admin/garantias", icon: ShieldCheck },
  { label: "Sedes", href: "/admin/sedes", icon: MapPin },
];
