import Link from "next/link";
import Image from "next/image";
import { ArrowRight, MapPin } from "lucide-react";
import { Section } from "@/components/public/section";
import { HeroTitle } from "@/components/public/hero-title";
import { BrandPhoto, type PhotoName } from "@/components/public/brand-photo";

const tiempos: { n: string; title: string; text: string; photo: PhotoName; alt: string }[] = [
  { n: "1", title: "Lo explicamos.", text: "La falla, la causa y la propuesta de trabajo, antes de reparar.", photo: "explica", alt: "Técnico explicando la falla a una clienta en su cocina" },
  { n: "2", title: "Lo reparamos.", text: "En tu domicilio o en el punto físico, según el caso.", photo: "tarjeta", alt: "Manos sosteniendo una tarjeta electrónica de una lavadora abierta" },
  { n: "3", title: "Lo garantizamos.", text: "El plazo de la garantía se asigna por reparación: 30 días, 3 o 6 meses.", photo: "antesDespues", alt: "Calentador a gas antes y después de la reparación" },
];
const equipos = [["nevera", "Nevera"], ["lavadora", "Lavadora"], ["estufa", "Estufa"], ["horno", "Horno"], ["calentador", "Calentador"], ["aire", "Aire acondicionado"]];
const servicios = [["Diagnóstico", "Revisamos el equipo y explicamos la causa probable."], ["Reparación", "Coordinamos la reparación una vez aprobado el trabajo."], ["Mantenimiento", "Cuidado preventivo para tus electrodomésticos."]];

export default function Home() { return <>
  <Section hero className="min-h-[min(92vh,900px)]">
    <span className="eyebrow">Tecnielectrogas · Bogotá y Cali</span>
    <HeroTitle big lead="Claro" rest="desde el diagnóstico." />
    <div className="mt-[clamp(40px,6vw,80px)] grid items-end gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-14">
      <div>
        <p className="lead max-w-xl">Reparamos y mantenemos electrodomésticos eléctricos y a gas. Te explicamos la falla y el trabajo recomendado antes de reparar.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link href="/sedes/bogota" className="btn-primary">Sede Bogotá <ArrowRight size={18} /></Link><Link href="/sedes/cali" className="btn-secondary">Sede Cali</Link></div>
        <p className="mt-8 flex items-start gap-2 text-sm text-gris"><MapPin size={16} className="mt-0.5 shrink-0" /> Atención a domicilio y en punto físico, con cita confirmada.</p>
      </div>
      <BrandPhoto name="tecnico" priority tilt="right" alt="Técnico de Tecnielectrogas en su taller" className="mx-auto w-full max-w-sm md:max-w-none" />
    </div>
  </Section>

  <Section dark>
    <span className="eyebrow">Nuestra forma de trabajar</span>
    <h2 className="section-title !text-papel">Lo explicamos. Lo reparamos. Lo garantizamos.</h2>
    <div className="mt-14 grid gap-14 md:grid-cols-3 md:gap-8">
      {tiempos.map(t => <article key={t.n} className="flex flex-col">
        <BrandPhoto name={t.photo} alt={t.alt} />
        <span className="mt-8 font-mono text-5xl font-medium text-accent-light">{t.n}</span>
        <h3 className="mt-2 text-2xl font-semibold">{t.title}</h3>
        <p className="mt-2 text-niebla/85">{t.text}</p>
      </article>)}
    </div>
  </Section>

  <Section>
    <span className="eyebrow">Servicios</span>
    <h2 className="section-title">Para que tu equipo vuelva a funcionar</h2>
    <div className="mt-10 grid gap-5 md:grid-cols-3">{servicios.map(([t, p]) => <article key={t} className="card"><h3 className="text-xl font-semibold">{t}</h3><p className="mt-2 text-gris">{p}</p></article>)}</div>
    <p className="mt-16 font-mono text-xs uppercase tracking-[0.14em] text-gris">Equipos eléctricos y a gas</p>
    <ul className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{equipos.map(([f, l]) => <li key={f} className="flex flex-col items-center gap-2 border border-niebla bg-white p-4 text-center"><Image src={`/brand/iconos/${f}.png`} alt="" width={96} height={96} className="h-20 w-20" /><span className="text-sm font-medium">{l}</span></li>)}</ul>
  </Section>

  <Section end>
    <span className="eyebrow">Sedes</span>
    <h2 className="section-title">Dos sedes, una misma forma de atender</h2>
    <div className="mt-10 grid gap-5 md:grid-cols-2">{[{ city: "Bogotá", slug: "bogota" }, { city: "Cali", slug: "cali" }].map(i => <article key={i.slug} className="card"><span className="eyebrow">Sede</span><h3 className="mt-2 text-3xl font-semibold">{i.city}</h3><p className="mt-3 text-gris">Agenda atención a domicilio o coordina el ingreso del equipo al punto físico.</p><Link href={`/sedes/${i.slug}`} className="btn-primary mt-6">Ver página de {i.city} <ArrowRight size={18} /></Link></article>)}</div>
  </Section>
</>; }
