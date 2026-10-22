import Image from "next/image";
import { cn } from "@/lib/utils";
const files = { explica: "f_explica", tecnico: "f_tecnico", nevera: "f_nevera", tarjeta: "f_tarjeta", antesDespues: "f_antes_despues" } as const;
export type PhotoName = keyof typeof files;
/** Foto del manual con marco papel. Son imágenes de referencia: se reemplazan por fotos reales del equipo. */
export function BrandPhoto({ name, alt, className, priority, tilt }: { name: PhotoName; alt: string; className?: string; priority?: boolean; tilt?: "left" | "right" }) {
  return <figure className={cn("m-0 max-w-full", className)}>
    <div className={cn("relative aspect-[4/5] overflow-hidden border-[6px] border-papel bg-niebla shadow-[6px_6px_0_#E0975F] md:border-8 md:shadow-[10px_10px_0_#E0975F]", tilt === "left" && "-rotate-1", tilt === "right" && "rotate-1")}>
      <Image src={`/brand/fotos/${files[name]}.jpg`} alt={alt} fill priority={priority} sizes="(min-width: 1024px) 38vw, (min-width: 640px) 60vw, 90vw" className="object-cover" />
    </div>
    <figcaption className="mt-4 font-mono text-[11px] uppercase tracking-[0.14em] opacity-70">Imagen de referencia</figcaption>
  </figure>;
}
