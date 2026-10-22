import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/public/section";
import { HeroTitle } from "@/components/public/hero-title";
export const metadata: Metadata = { title: "Sedes y cobertura", description: "Tecnielectrogas recibe solicitudes en Bogotá y Cali, con servicio a domicilio y atención en punto físico." };
export default function Page() { return <>
  <Section hero>
    <span className="eyebrow">Cobertura actual</span>
    <HeroTitle lead="Dos sedes," rest="una misma forma de atender." />
    <p className="lead mt-8 max-w-2xl">Recibimos solicitudes en Bogotá y Cali. Selecciona la sede para solicitar visita a domicilio o coordinar la entrega del equipo en el punto físico.</p>
  </Section>
  <Section end>
    <div className="grid gap-5 md:grid-cols-2">{[{ name: "Bogotá", slug: "bogota" }, { name: "Cali", slug: "cali" }].map(i => <article className="card" key={i.slug}><span className="eyebrow">Sede</span><h2 className="mt-2 text-3xl font-semibold">{i.name}</h2><p className="mt-3 text-gris">Servicio a domicilio y en punto físico, sujeto a confirmación de zona y horario.</p><Link href={`/sedes/${i.slug}`} className="btn-primary mt-6">Ver sede {i.name}</Link></article>)}</div>
  </Section>
</>; }
