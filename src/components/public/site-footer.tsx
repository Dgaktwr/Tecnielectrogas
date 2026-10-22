import Link from "next/link";
import Image from "next/image";
export function SiteFooter() {
  return <footer className="relative z-[2] bg-pizarra pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))] pt-12 text-sm text-niebla">
    <div className="wrap flex flex-col justify-between gap-10 md:flex-row">
      <div>
        <Image src="/brand/tecnielectrogas_horizontal_negativo.svg" alt="Tecnielectrogas" width={9614} height={2062} className="h-8 w-auto" />
        <p className="mt-4 font-semibold text-papel">Lo explicamos, lo reparamos, lo garantizamos.</p>
        <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-accent-light">Bogotá · Cali</p>
      </div>
      <nav aria-label="Enlaces del pie" className="flex flex-wrap content-start gap-x-6 gap-y-3">
        {[["Servicios", "/servicios"], ["Cobertura", "/cobertura"], ["Nosotros", "/nosotros"], ["Contacto", "/contacto"], ["Panel administrativo", "/admin"]].map(([l, h]) => <Link key={h} href={h} className="hover:text-accent-light">{l}</Link>)}
      </nav>
    </div>
  </footer>;
}
