"use client";
import { FormEvent, useState } from "react";
import type { Sede } from "@/lib/operations";

export function ContactForm({ sede, enabledSedes }: { sede?: Sede; enabledSedes: Record<Sede, boolean> }) {
  const [mode, setMode] = useState<"domicilio" | "punto">("domicilio");
  const [chosen, setChosen] = useState<Sede | "">(sede ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch("/api/solicitudes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "No se pudo registrar la solicitud.");
      setMessage(`Solicitud ${result.numero} registrada. Abriendo WhatsApp para enviarla y confirmar la cita.`);
      window.location.assign(result.whatsappUrl);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Ocurrió un error."); setBusy(false); }
  }
  return <form onSubmit={submit} className="card grid gap-5 sm:grid-cols-2">
    <div className="hidden" aria-hidden="true"><label>Sitio web<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
    <label className="form-label">Nombre completo<input className="form-input" name="nombre" required maxLength={100} autoComplete="name"/></label>
    <label className="form-label">Teléfono / WhatsApp<input className="form-input" name="telefono" type="tel" required minLength={7} maxLength={25} autoComplete="tel"/></label>
    <label className="form-label">Correo electrónico<input className="form-input" name="email" type="email" required maxLength={254} autoComplete="email"/></label>
    {sede ? <div className="form-label">Sede<input type="hidden" name="sede" value={sede}/><p className="form-input">{sede === "bogota" ? "Bogotá" : "Cali"}</p></div> : <label className="form-label">Sede<select className="form-input" name="sede" required value={chosen} onChange={e => setChosen(e.target.value as Sede)}><option value="" disabled>Selecciona una sede</option><option value="bogota">Bogotá</option><option value="cali">Cali</option></select></label>}
    <label className="form-label">Modalidad<select className="form-input" name="modalidad" value={mode} onChange={e => setMode(e.target.value as "domicilio" | "punto")}><option value="domicilio">Domicilio</option><option value="punto">Llevar al punto físico</option></select></label>
    <label className="form-label">{mode === "domicilio" ? "Dirección del servicio" : "Dirección (opcional)"}<input className="form-input" name="direccion" required={mode === "domicilio"} maxLength={200} autoComplete="street-address" placeholder={mode === "domicilio" ? "Dirección y barrio" : "Te confirmaremos la dirección del punto"}/></label>
    <label className="form-label">Electrodoméstico<input className="form-input" name="equipo" required maxLength={80} placeholder="Ej. nevera, lavadora"/></label>
    <label className="form-label">Marca<input className="form-input" name="marca" maxLength={80} placeholder="Si la conoces"/></label>
    <label className="form-label">Modelo<input className="form-input" name="modelo" maxLength={80} placeholder="Si lo conoces"/></label>
    <label className="form-label">Servicio<select className="form-input" name="tipoServicio" required defaultValue=""><option value="" disabled>Selecciona un servicio</option><option>Diagnóstico</option><option>Reparación</option><option>Mantenimiento</option></select></label>
    <label className="form-label">Fecha y hora preferida<input className="form-input" name="fechaPreferida" type="datetime-local"/><span className="font-normal text-slate-500">Sujeta a confirmación por WhatsApp.</span></label>
    <label className="form-label sm:col-span-2">¿Qué sucede con el equipo?<textarea className="form-input min-h-32" name="descripcion" required minLength={10} maxLength={1000}/></label>
    <label className="flex items-start gap-3 text-sm text-slate-600 sm:col-span-2"><input type="checkbox" name="consentimiento" value="si" required className="mt-1"/>Autorizo el contacto por WhatsApp y el tratamiento de mis datos para gestionar esta solicitud.</label>
    <div className="sm:col-span-2"><button className="btn-primary" disabled={busy || !chosen || !enabledSedes[chosen]}>{busy ? "Preparando WhatsApp…" : "Enviar datos por WhatsApp"}</button><p className="mt-2 text-xs text-slate-500">{chosen && !enabledSedes[chosen] ? "WhatsApp de esta sede pendiente de activación." : "WhatsApp abrirá el mensaje. Debes pulsar Enviar allí para completar el contacto. La cita se confirma después."}</p><p role="status" aria-live="polite" className="mt-3 text-sm text-brand">{message}</p></div>
  </form>;
}
