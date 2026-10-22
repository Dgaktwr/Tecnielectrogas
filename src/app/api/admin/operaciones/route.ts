import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createService, listOperations, updateService } from "@/lib/operations";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const states = ["Solicitud recibida", "Por agendar", "Agendado", "En servicio", "Finalizado", "Cancelado"] as const;
const updateSchema = z.object({
  id: z.string().uuid(), fechaCita: z.string().max(40).optional(), tecnicoId: z.string().max(80).optional(),
  estado: z.enum(states).optional(), garantiaPlazo: z.union([z.enum(["30d", "3m", "6m"]), z.null()]).optional(),
  garantiaInicio: z.string().regex(/^$|^\d{4}-\d{2}-\d{2}$/).optional(), notas: z.string().max(2000).optional(),
});
const createSchema = z.object({
  nombre: z.string().trim().min(2).max(100), telefono: z.string().trim().min(7).max(25), email: z.union([z.literal(""), z.string().trim().email().max(254)]),
  sede: z.enum(["bogota", "cali"]), modalidad: z.enum(["domicilio", "punto"]), direccion: z.string().trim().max(200),
  equipo: z.string().trim().min(2).max(80), marca: z.string().trim().max(80), modelo: z.string().trim().max(80),
  tipoServicio: z.string().trim().min(2).max(80), descripcion: z.string().trim().min(5).max(1000), fechaPreferida: z.string().max(40),
});
function sameOrigin(request: NextRequest) { const origin = request.headers.get("origin"); return !origin || origin === request.nextUrl.origin; }
const headers = { "Cache-Control": "no-store" };
export async function GET() { return NextResponse.json(await listOperations(), { headers }); }
export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Datos incompletos." }, { status: 400 });
  try { return NextResponse.json(await createService(parsed.data), { status: 201, headers }); }
  catch { return NextResponse.json({ error: "No se pudo guardar el servicio." }, { status: 500 }); }
}
export async function PATCH(request: NextRequest) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  const parsed = updateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  const { id, ...changes } = parsed.data;
  try { const service = await updateService(id, changes); return service ? NextResponse.json(service, { headers }) : NextResponse.json({ error: "Servicio no encontrado." }, { status: 404 }); }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo actualizar." }, { status: 400 }); }
}
