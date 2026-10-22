import { cn } from "@/lib/utils";
type Props = { children: React.ReactNode; id?: string; hero?: boolean; dark?: boolean; end?: boolean; className?: string; wrapClassName?: string };
/** Sección de la marca: ancho completo, contenido dentro de .wrap y espacio superior para que el cable cruce. */
export function Section({ children, id, hero, dark, end, className, wrapClassName }: Props) {
  return <section id={id} data-brand-section="" data-brand-dark={dark ? "" : undefined}
    className={cn("relative scroll-mt-20",
      hero ? "pb-[clamp(72px,9vw,128px)] pt-[clamp(32px,5vw,72px)]" : "pt-[clamp(96px,11vw,150px)] pb-[clamp(56px,7vw,100px)]",
      end && "pb-[clamp(230px,24vw,300px)]", dark && "bg-pizarra text-papel", className)}>
    <div className={cn("wrap", wrapClassName)}>{children}</div>
  </section>;
}
