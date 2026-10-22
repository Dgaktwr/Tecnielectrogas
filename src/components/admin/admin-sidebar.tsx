"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNav } from "@/lib/nav";
import { cn } from "@/lib/utils";
export function AdminSidebar() {
  const path = usePathname();
  return (
    <aside className="border-b bg-brand text-slate-100 md:min-h-screen md:w-60 md:border-b-0">
      <div className="flex items-center justify-between gap-3 p-4 font-bold text-white"><span>TECNIELECTROGAS · Admin</span><Link href="/" className="text-xs font-normal text-slate-200 underline">Ver sitio</Link></div>
      <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col">
        {adminNav.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? path === href : path.startsWith(href);
          return (<Link key={href} href={href} className={cn("flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-brand-light", active && "bg-brand-light")}>
            <Icon className="h-4 w-4" />{label}</Link>);
        })}
      </nav>
    </aside>
  );
}
