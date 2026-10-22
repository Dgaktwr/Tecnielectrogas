import { cn } from "@/lib/utils";
/** El punto del manual: el diagnóstico. De aquí nace el cable (id único por página). */
export function BrandDot() {
  return <span id="brand-start" aria-hidden="true" className="inline-block h-[.32em] w-[.32em] flex-none translate-y-[.04em] rounded-full bg-accent" />;
}
/** Titular grande: primera palabra + punto en la primera línea, el resto debajo. */
export function HeroTitle({ lead, rest, big, className }: { lead: string; rest: string; big?: boolean; className?: string }) {
  return <h1 className={cn("mt-6 font-semibold leading-[.92] tracking-[-0.04em] [text-wrap:balance]",
    big ? "text-[length:clamp(46px,10.5vw,148px)]" : "text-[length:clamp(40px,7.6vw,108px)]", className)}>
    <span className="flex items-center gap-[.12em]">{lead}<BrandDot /></span>{rest}
  </h1>;
}
