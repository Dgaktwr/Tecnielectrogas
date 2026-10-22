import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { addTechnician, listOperations } from "@/lib/operations";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const schema = z.object({ nombre: z.string().trim().min(2).max(100), sede: z.enum(["bogota", "cali"]), telefono: z.string().trim().max(25) });
export async function GET() { const data = await listOperations(); return NextResponse.json(data.tecnicos, { headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin"); if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ error: "Origen no autorizado." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Datos no válidos." }, { status: 400 });
  try { return NextResponse.json(await addTechnician(parsed.data), { status: 201, headers: { "Cache-Control": "no-store" } }); }
  catch { return NextResponse.json({ error: "No se pudo guardar el técnico." }, { status: 500 }); }
}
