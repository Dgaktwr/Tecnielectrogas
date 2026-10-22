import type { Metadata } from "next";
import Link from "next/link";
import { Section } from "@/components/public/section";
import { HeroTitle } from "@/components/public/hero-title";
export const metadata: Metadata = { title: "Nosotros", description: "Conoce el proceso de servicio técnico de Tecnielectrogas." };
const pasos = [["1. Cuéntanos", "Describe la falla y comparte tus datos de contacto."], ["2. Revisamos", "Evaluamos tu solicitud y la cobertura disponible."], ["3. Coordinamos", "Te contactamos para confirmar la atención."]];
export default function Page() { return <>
  <Section hero>
    <span className="eyebrow">Tecnielectrogas</span>
    <HeroTitle lead="Un proceso" rest="claro para cuidar tu hogar." />
    <p className="lead mt-8 max-w-3xl">Nuestro objetivo es ayudarte a resolver los problemas de tus electrodomésticos con información clara y atención coordinada. Recibimos tu solicitud, revisamos los datos del equipo y te contactamos para acordar los siguientes pasos.</p>
  </Section>
  <Section end>
    <div className="grid gap-5 md:grid-cols-3">{pasos.map(([t, p]) => <div className="card" key={t}><h2 className="font-semibold text-pizarra">{t}</h2><p className="mt-2 text-gris">{p}</p></div>)}</div>
    <Link href="/contacto" className="btn-primary mt-10">Solicitar servicio</Link>
  </Section>
</>; }
