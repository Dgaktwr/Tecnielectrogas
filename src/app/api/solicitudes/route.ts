import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createService } from "@/lib/operations";

export const runtime = "nodejs";
const schema = z.object({
  nombre: z.string().trim().min(2).max(100),
  telefono: z.string().trim().regex(/^[+()\d\s-]{7,25}$/),
  email: z.string().trim().email().max(254),
  sede: z.enum(["bogota", "cali"]),
  modalidad: z.enum(["domicilio", "punto"]),
  direccion: z.string().trim().max(200),
  equipo: z.string().trim().min(2).max(80),
  marca: z.string().trim().max(80),
  modelo: z.string().trim().max(80),
  tipoServicio: z.enum(["Diagnóstico", "Reparación", "Mantenimiento"]),
  descripcion: z.string().trim().min(10).max(1000),
  fechaPreferida: z.string().trim().max(40),
  consentimiento: z.literal("si"),
  website: z.string().optional(),
}).refine(data => data.modalidad !== "domicilio" || data.direccion.length >= 5);

const recent = new Map<string, number[]>();
function allowed(ip: string) {
  const now = Date.now();
  const attempts = (recent.get(ip) ?? []).filter(time => now - time < 60 * 60 * 1000);
  if (attempts.length >= 8) return false;
  attempts.push(now); recent.set(ip, attempts);
  if (recent.size > 2000) for (const [key, times] of recent) if (times.every(time => now - time >= 60 * 60 * 1000)) recent.delete(key);
  return true;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  if (!request.headers.get("content-type")?.startsWith("application/json")) return NextResponse.json({ error: "Formato no válido." }, { status: 415 });
  if (Number(request.headers.get("content-length") || 0) > 6000) return NextResponse.json({ error: "Solicitud demasiado grande." }, { status: 413 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Datos no válidos." }, { status: 400 }); }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Revisa los datos del formulario." }, { status: 400 });
  if (parsed.data.website) return NextResponse.json({ ok: true });
  const phone = parsed.data.sede === "bogota" ? process.env.WHATSAPP_BOGOTA : process.env.WHATSAPP_CALI;
  if (!phone || !/^\d{10,15}$/.test(phone)) return NextResponse.json({ error: "WhatsApp de esta sede aún no está configurado." }, { status: 503 });
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!allowed(ip)) return NextResponse.json({ error: "Demasiadas solicitudes. Intenta más tarde." }, { status: 429 });
  try {
    const { website, consentimiento, ...input } = parsed.data;
    const service = await createService(input);
    if (process.env.CRM_WEBHOOK_URL) {
      try {
        const url = new URL(process.env.CRM_WEBHOOK_URL);
        if (url.protocol === "https:") await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...(process.env.CRM_WEBHOOK_TOKEN ? { Authorization: `Bearer ${process.env.CRM_WEBHOOK_TOKEN}` } : {}) }, body: JSON.stringify({ source: "web-tecnielectrogas", service }), signal: AbortSignal.timeout(5000), cache: "no-store" });
      } catch { /* El registro local y WhatsApp siguen disponibles; el CRM requiere configuración final. */ }
    }
    const text = [
      `Solicitud ${service.numero} · Tecnielectrogas`,
      `Sede: ${service.sede === "bogota" ? "Bogotá" : "Cali"}`,
      `Cliente: ${service.nombre}`,
      `Teléfono: ${service.telefono}`,
      `Correo: ${service.email}`,
      `Atención: ${service.modalidad === "domicilio" ? "Domicilio" : "En punto físico"}`,
      ...(service.direccion ? [`Dirección: ${service.direccion}`] : []),
      `Equipo: ${service.equipo}`,
      ...(service.marca ? [`Marca: ${service.marca}`] : []),
      ...(service.modelo ? [`Modelo: ${service.modelo}`] : []),
      `Servicio: ${service.tipoServicio}`,
      `Detalle: ${service.descripcion}`,
      ...(service.fechaPreferida ? [`Fecha preferida: ${service.fechaPreferida}`] : []),
      "Por favor confirma disponibilidad, técnico y cita.",
    ].join("\n");
    return NextResponse.json({ numero: service.numero, whatsappUrl: `https://wa.me/${phone}?text=${encodeURIComponent(text)}` });
  } catch { return NextResponse.json({ error: "No pudimos registrar la solicitud. Intenta de nuevo." }, { status: 500 }); }
}
