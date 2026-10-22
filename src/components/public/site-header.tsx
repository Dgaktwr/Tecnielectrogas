"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { publicNav } from "@/lib/nav";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="sticky top-0 z-40 border-b border-niebla bg-papel/95 pt-[env(safe-area-inset-top,0px)] backdrop-blur">
    <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
      <Link href="/" aria-label="Tecnielectrogas, inicio" className="shrink-0"><Image src="/brand/tecnielectrogas_horizontal_positivo.svg" alt="Tecnielectrogas" width={9614} height={2062} priority className="h-7 w-auto" /></Link>
      <nav aria-label="Principal" className="hidden gap-7 lg:flex">{publicNav.map(n => <Link key={n.href} href={n.href} className="text-sm font-medium hover:text-accent">{n.label}</Link>)}</nav>
      <div className="flex items-center gap-3">
        <Link href="/admin" className="text-xs font-semibold text-accent underline-offset-4 hover:underline sm:text-sm"><span className="hidden lg:inline">Panel </span>Admin</Link>
        <Link href="/contacto" className="hidden bg-pizarra px-4 py-2 text-sm font-semibold text-papel hover:bg-brand-light sm:block">Solicitar servicio</Link>
        <button className="p-1 lg:hidden" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
    </div>
    {open && <nav aria-label="Menú móvil" className="flex flex-col gap-1 border-t border-niebla bg-papel px-4 py-3 sm:px-6 lg:hidden">
      {publicNav.map(n => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="py-2.5 font-medium">{n.label}</Link>)}
      <Link href="/contacto" onClick={() => setOpen(false)} className="btn-primary mt-2">Solicitar servicio</Link>
      <Link href="/admin" onClick={() => setOpen(false)} className="py-2.5 text-sm font-semibold text-accent">Panel administrativo</Link>
    </nav>}
  </header>;
}
