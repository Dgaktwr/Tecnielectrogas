import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

export type Sede = "bogota" | "cali";
export type Modalidad = "domicilio" | "punto";
export type EstadoServicio = "Solicitud recibida" | "Por agendar" | "Agendado" | "En servicio" | "Finalizado" | "Cancelado";
export type GarantiaPlazo = "30d" | "3m" | "6m";
export type Tecnico = { id: string; nombre: string; sede: Sede; telefono: string; activo: boolean };
export type Servicio = {
  id: string; numero: string; creado: string; nombre: string; telefono: string; email: string;
  sede: Sede; modalidad: Modalidad; direccion: string; equipo: string; marca: string; modelo: string;
  tipoServicio: string; descripcion: string; fechaPreferida: string; fechaCita: string;
  tecnicoId: string; estado: EstadoServicio; garantiaPlazo: GarantiaPlazo | null;
  garantiaInicio: string; garantiaVence: string; notas: string; whatsapp: "Enlace generado";
};
type Database = { secuencia: number; servicios: Servicio[]; tecnicos: Tecnico[] };
const file = path.join(process.cwd(), "data", "operaciones.json");
let queue: Promise<unknown> = Promise.resolve();

async function read(): Promise<Database> {
  try { return JSON.parse(await readFile(file, "utf8")) as Database; }
  catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return { secuencia: 0, servicios: [], tecnicos: [] }; throw error; }
}
async function save(data: Database) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2), { encoding: "utf8", mode: 0o600 });
  await rename(temp, file);
}
function mutate<T>(action: (data: Database) => T | Promise<T>): Promise<T> {
  const task = queue.then(async () => { const data = await read(); const result = await action(data); await save(data); return result; });
  queue = task.catch(() => undefined);
  return task;
}
export async function listOperations() { return read(); }
export async function createService(input: Omit<Servicio, "id" | "numero" | "creado" | "fechaCita" | "tecnicoId" | "estado" | "garantiaPlazo" | "garantiaInicio" | "garantiaVence" | "notas" | "whatsapp">) {
  return mutate(data => {
    data.secuencia += 1;
    const service: Servicio = { ...input, id: randomUUID(), numero: `OS-${new Date().getFullYear()}-${String(data.secuencia).padStart(5, "0")}`, creado: new Date().toISOString(), fechaCita: "", tecnicoId: "", estado: "Solicitud recibida", garantiaPlazo: null, garantiaInicio: "", garantiaVence: "", notas: "", whatsapp: "Enlace generado" };
    data.servicios.unshift(service);
    return service;
  });
}
export async function addTechnician(input: Pick<Tecnico, "nombre" | "sede" | "telefono">) {
  return mutate(data => { const tech: Tecnico = { ...input, id: randomUUID(), activo: true }; data.tecnicos.push(tech); return tech; });
}
export async function updateService(id: string, changes: Partial<Pick<Servicio, "fechaCita" | "tecnicoId" | "estado" | "garantiaPlazo" | "garantiaInicio" | "notas">>) {
  return mutate(data => {
    const service = data.servicios.find(item => item.id === id);
    if (!service) return null;
    if (changes.tecnicoId) { const tech = data.tecnicos.find(item => item.id === changes.tecnicoId && item.sede === service.sede && item.activo); if (!tech) throw new Error("Técnico no disponible para esta sede."); }
    Object.assign(service, changes);
    if (service.garantiaPlazo && service.garantiaInicio) {
      const end = new Date(`${service.garantiaInicio}T12:00:00Z`);
      if (service.garantiaPlazo === "30d") end.setUTCDate(end.getUTCDate() + 30);
      else {
        const day = end.getUTCDate();
        end.setUTCDate(1);
        end.setUTCMonth(end.getUTCMonth() + (service.garantiaPlazo === "3m" ? 3 : 6));
        const lastDay = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth() + 1, 0)).getUTCDate();
        end.setUTCDate(Math.min(day, lastDay));
      }
      service.garantiaVence = end.toISOString().slice(0, 10);
    } else service.garantiaVence = "";
    return service;
  });
}
