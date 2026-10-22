import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/public/section";
import { HeroTitle } from "@/components/public/hero-title";
import { BrandPhoto } from "@/components/public/brand-photo";
export const metadata: Metadata = { title: "Servicios", description: "Diagnóstico, reparación y mantenimiento de electrodomésticos para tu hogar." };
const items = [{ title: "Diagnóstico", text: "Revisamos el equipo y sus síntomas para identificar el problema y orientarte sobre la solución." }, { title: "Reparación", text: "Te explicamos el trabajo recomendado y coordinamos la intervención de acuerdo con la disponibilidad." }, { title: "Mantenimiento", text: "Realizamos tareas preventivas para cuidar el funcionamiento de tus electrodomésticos." }];
export default function Page() { return <>
  <Section hero>
    <span className="eyebrow">Servicios</span>
    <HeroTitle lead="Ayuda" rest="para tus electrodomésticos." />
    <p className="lead mt-8 max-w-2xl">Cada equipo tiene necesidades distintas. Cuéntanos qué ocurre y te ayudaremos a definir el siguiente paso.</p>
  </Section>
  <Section>
    <div className="grid items-center gap-12 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="grid gap-5">{items.map(x => <article className="card" key={x.title}><h2 className="text-xl font-semibold">{x.title}</h2><p className="mt-3 text-gris">{x.text}</p></article>)}</div>
      <BrandPhoto name="nevera" tilt="left" alt="Técnico reparando una nevera en una cocina" className="mx-auto w-full max-w-sm md:max-w-none" />
    </div>
  </Section>
  <Section end><h2 className="section-title">¿Qué le pasa a tu equipo?</h2><p className="lead mt-4 max-w-xl">Cuéntanos y coordinamos contigo la atención.</p><Link href="/contacto" className="btn-primary mt-8">Solicitar servicio</Link></Section>
</>; }
