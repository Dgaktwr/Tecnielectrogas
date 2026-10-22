"use client";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Servicio, Tecnico, Sede, EstadoServicio } from "@/lib/operations";

type View = "resumen" | "servicios" | "tecnicos" | "garantias" | "sedes";
type Data = { servicios: Servicio[]; tecnicos: Tecnico[]; secuencia: number };
const city = (sede: Sede) => sede === "bogota" ? "Bogotá" : "Cali";
const states: EstadoServicio[] = ["Solicitud recibida", "Por agendar", "Agendado", "En servicio", "Finalizado", "Cancelado"];
const date = (value: string) => value ? new Date(value).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" }) : "Por confirmar";
const input = "form-input";

export function AdminDashboard({ view }: { view: View }) {
  const [data, setData] = useState<Data>({ servicios: [], tecnicos: [], secuencia: 0 });
  const [selected, setSelected] = useState("");
  const [filter, setFilter] = useState<"todas" | Sede>("todas");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => {
    try { const response = await fetch("/api/admin/operaciones", { cache: "no-store" }); if (!response.ok) throw new Error("No se pudo cargar la información."); setData(await response.json()); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Error de carga."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const filtered = useMemo(() => data.servicios.filter(s => filter === "todas" || s.sede === filter), [data.servicios, filter]);
  const current = data.servicios.find(s => s.id === selected);
  async function send(url: string, method: "POST" | "PATCH", payload: object, form?: HTMLFormElement) {
    setBusy(true); setNotice("");
    try { const response = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); const result = await response.json(); if (!response.ok) throw new Error(result.error || "No se pudo guardar."); setNotice("Cambios guardados."); form?.reset(); await load(); }
    catch (error) { setNotice(error instanceof Error ? error.message : "Error al guardar."); }
    finally { setBusy(false); }
  }
  function addTech(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const fields = Object.fromEntries(new FormData(form)); void send("/api/admin/tecnicos", "POST", fields, form); }
  function addService(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const form = event.currentTarget; const fields = Object.fromEntries(new FormData(form)); void send("/api/admin/operaciones", "POST", fields, form); }
  function saveService(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!current) return;
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    void send("/api/admin/operaciones", "PATCH", { id: current.id, ...fields, garantiaPlazo: fields.garantiaPlazo || null });
  }
  const totals = { pending: filtered.filter(s => ["Solicitud recibida", "Por agendar"].includes(s.estado)).length, scheduled: filtered.filter(s => s.estado === "Agendado").length, working: filtered.filter(s => s.estado === "En servicio").length, warranty: filtered.filter(s => s.garantiaVence && s.garantiaVence >= new Date().toISOString().slice(0, 10)).length };
  const headings: Record<View, string> = { resumen: "Resumen de operaciones", servicios: "Agenda y servicios", tecnicos: "Técnicos por sede", garantias: "Garantías", sedes: "Sedes" };
  return <div className="mx-auto max-w-7xl space-y-7">
    <div><p className="eyebrow">Panel administrativo</p><h1 className="section-title">{headings[view]}</h1><p className="mt-2 text-sm text-slate-600">Las solicitudes web aparecen al generar el enlace de WhatsApp. La atención y el envío del mensaje se confirman con el cliente.</p></div>
    {notice && <p role="status" className="rounded-lg border border-accent/30 bg-brand-soft p-3 text-sm">{notice}</p>}
    {view === "resumen" && <div className="flex flex-wrap gap-3"><Link href="/admin/servicios" className="btn-primary">Registrar y asignar servicio</Link><Link href="/admin/tecnicos" className="btn-secondary">Gestionar técnicos</Link><Link href="/admin/garantias" className="btn-secondary">Ver garantías</Link></div>}
    <div className="flex flex-wrap items-center gap-3"><label className="text-sm font-semibold" htmlFor="sede-filter">Filtrar sede</label><select id="sede-filter" className="form-input max-w-52" value={filter} onChange={e => setFilter(e.target.value as "todas" | Sede)}><option value="todas">Todas</option><option value="bogota">Bogotá</option><option value="cali">Cali</option></select><button className="btn-secondary !px-4 !py-2 text-sm" onClick={() => void load()}>Actualizar</button></div>
    {loading ? <p>Cargando operaciones…</p> : <>
      {(view === "resumen" || view === "sedes") && <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Por atender", totals.pending], ["Agendados", totals.scheduled], ["En servicio", totals.working], ["Garantías vigentes", totals.warranty]].map(([label, value]) => <div className="card" key={label}><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold text-brand">{value}</p></div>)}</div>}
      {view === "sedes" && <div className="grid gap-5 md:grid-cols-2">{(["bogota", "cali"] as Sede[]).map(sede => <article className="card" key={sede}><h2 className="text-xl font-bold">{city(sede)}</h2><p className="mt-2">{data.servicios.filter(s => s.sede === sede).length} servicios · {data.tecnicos.filter(t => t.sede === sede).length} técnicos</p><Link className="mt-4 inline-block font-semibold text-accent" href={`/sedes/${sede}`}>Ver página de la sede →</Link></article>)}</div>}
      {(view === "resumen" || view === "servicios") && <>
        {view === "servicios" && <details className="card" open><summary className="cursor-pointer text-xl font-bold text-brand">Registrar servicio recibido por WhatsApp o teléfono</summary><form onSubmit={addService} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="form-label">Cliente<input className={input} name="nombre" required/></label><label className="form-label">Teléfono<input className={input} name="telefono" required/></label><label className="form-label">Correo (opcional)<input className={input} name="email" type="email"/></label><label className="form-label">Sede<select className={input} name="sede"><option value="bogota">Bogotá</option><option value="cali">Cali</option></select></label>
          <label className="form-label">Modalidad<select className={input} name="modalidad"><option value="domicilio">Domicilio</option><option value="punto">Punto físico</option></select></label><label className="form-label">Dirección<input className={input} name="direccion"/></label>
          <label className="form-label">Electrodoméstico<input className={input} name="equipo" required/></label><label className="form-label">Marca<input className={input} name="marca"/></label><label className="form-label">Modelo<input className={input} name="modelo"/></label><label className="form-label">Tipo de servicio<select className={input} name="tipoServicio"><option>Diagnóstico</option><option>Reparación</option><option>Mantenimiento</option></select></label>
          <label className="form-label">Fecha preferida<input className={input} name="fechaPreferida" type="datetime-local"/></label><label className="form-label sm:col-span-2">Descripción<textarea className={input} name="descripcion" required minLength={5}/></label><button className="btn-primary sm:col-span-2" disabled={busy}>Registrar servicio</button>
        </form></details>}
        <section className="card overflow-x-auto"><h2 className="mb-4 text-xl font-bold">{view === "resumen" ? "Servicios recientes" : "Órdenes y citas"}</h2>{filtered.length ? <table className="w-full min-w-[850px] text-left text-sm"><thead><tr className="border-b text-slate-500"><th className="pb-3">Número</th><th className="pb-3">Cliente y equipo</th><th className="pb-3">Sede / atención</th><th className="pb-3">Cita</th><th className="pb-3">Técnico</th><th className="pb-3">Estado</th><th className="pb-3"></th></tr></thead><tbody>{filtered.map(s => <tr key={s.id} className="border-b last:border-0"><td className="py-3 font-bold">{s.numero}</td><td className="py-3">{s.nombre}<br/><span className="text-slate-500">{s.equipo}{s.marca ? ` · ${s.marca}` : ""}</span></td><td>{city(s.sede)}<br/><span className="text-slate-500">{s.modalidad === "domicilio" ? "Domicilio" : "Punto físico"}</span></td><td>{date(s.fechaCita)}</td><td>{data.tecnicos.find(t => t.id === s.tecnicoId)?.nombre || "Sin asignar"}</td><td>{s.estado}</td><td><button className="font-semibold text-accent underline" onClick={() => setSelected(s.id)}>Gestionar</button></td></tr>)}</tbody></table> : <p className="text-slate-600">Todavía no hay servicios registrados para esta sede. <Link href="/admin/servicios" className="font-bold text-accent underline">Registra el primero</Link> y después podrás asignar técnico, cita y garantía.</p>}</section>
        {current && <section className="card" aria-label={`Gestionar ${current.numero}`}><div className="flex items-start justify-between gap-4"><div><p className="eyebrow">{current.numero}</p><h2 className="mt-1 text-2xl font-bold">{current.equipo} · {current.nombre}</h2><p className="mt-2 text-sm text-slate-600">{city(current.sede)} · {current.modalidad === "domicilio" ? `Domicilio: ${current.direccion}` : "Punto físico"} · {current.telefono}</p><p className="mt-2 text-sm">{current.descripcion}</p><p className="mt-2 text-xs text-slate-500">WhatsApp: enlace generado; confirmar envío y cita con el cliente.</p></div><button onClick={() => setSelected("")} aria-label="Cerrar detalle">✕</button></div><form key={current.id} onSubmit={saveService} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="form-label">Estado<select name="estado" className={input} defaultValue={current.estado}>{states.map(x => <option key={x}>{x}</option>)}</select></label>
          <label className="form-label">Técnico asignado<select name="tecnicoId" className={input} defaultValue={current.tecnicoId}><option value="">Sin asignar</option>{data.tecnicos.filter(t => t.sede === current.sede && t.activo).map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></label>
          <label className="form-label">Fecha y hora de cita<input name="fechaCita" className={input} type="datetime-local" defaultValue={current.fechaCita}/></label>
          <label className="form-label">Garantía<select name="garantiaPlazo" className={input} defaultValue={current.garantiaPlazo ?? ""}><option value="">Sin definir</option><option value="30d">30 días</option><option value="3m">3 meses</option><option value="6m">6 meses</option></select></label>
          <label className="form-label">Inicio de garantía<input name="garantiaInicio" className={input} type="date" defaultValue={current.garantiaInicio}/></label><div className="flex items-end text-sm text-slate-600">Vence: {current.garantiaVence || "Por definir"}</div>
          <label className="form-label sm:col-span-2">Notas internas<textarea name="notas" className={input} rows={3} maxLength={2000} defaultValue={current.notas}/></label><button className="btn-primary sm:col-span-2" disabled={busy}>Guardar cambios</button>
        </form></section>}
      </>}
      {view === "tecnicos" && <><form onSubmit={addTech} className="card grid gap-4 sm:grid-cols-4"><h2 className="text-xl font-bold sm:col-span-4">Agregar técnico</h2><label className="form-label sm:col-span-2">Nombre<input className={input} name="nombre" required minLength={2}/></label><label className="form-label">Sede<select className={input} name="sede"><option value="bogota">Bogotá</option><option value="cali">Cali</option></select></label><label className="form-label">Teléfono<input className={input} name="telefono" type="tel"/></label><button className="btn-primary sm:col-span-4" disabled={busy}>Guardar técnico</button></form><section className="grid gap-4 md:grid-cols-2">{data.tecnicos.filter(t => filter === "todas" || t.sede === filter).map(t => <article className="card" key={t.id}><h2 className="text-lg font-bold">{t.nombre}</h2><p>{city(t.sede)} · {t.telefono || "Sin teléfono"}</p><p className="mt-2 text-sm text-slate-600">{data.servicios.filter(s => s.tecnicoId === t.id && s.estado === "En servicio").length} servicio(s) en curso</p></article>)}</section></>}
      {view === "garantias" && <section className="card overflow-x-auto"><h2 className="mb-4 text-xl font-bold">Registro de garantías</h2>{filtered.filter(s => s.garantiaPlazo).length ? <table className="w-full min-w-[650px] text-left text-sm"><thead><tr className="border-b"><th className="pb-3">Servicio</th><th>Equipo</th><th>Sede</th><th>Plazo</th><th>Inicio</th><th>Vencimiento</th></tr></thead><tbody>{filtered.filter(s => s.garantiaPlazo).map(s => <tr className="border-b last:border-0" key={s.id}><td className="py-3 font-bold">{s.numero}</td><td>{s.equipo}</td><td>{city(s.sede)}</td><td>{s.garantiaPlazo === "30d" ? "30 días" : s.garantiaPlazo === "3m" ? "3 meses" : "6 meses"}</td><td>{s.garantiaInicio || "Pendiente"}</td><td>{s.garantiaVence || "Pendiente"}</td></tr>)}</tbody></table> : <p className="text-slate-600">Aún no hay garantías asignadas. Se definen manualmente por reparación: 30 días, 3 meses o 6 meses.</p>}</section>}
    </>}
  </div>;
}
