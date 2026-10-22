import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ContactForm } from "@/components/public/contact-form";
import { Section } from "@/components/public/section";
import { HeroTitle } from "@/components/public/hero-title";
import { BrandPhoto } from "@/components/public/brand-photo";
import type { Sede } from "@/lib/operations";
export const dynamic = "force-dynamic";

export function generateStaticParams() { return [{ sede: "bogota" }, { sede: "cali" }]; }
export async function generateMetadata({ params }: { params: Promise<{ sede: string }> }): Promise<Metadata> {
  const { sede } = await params; if (sede !== "bogota" && sede !== "cali") return {};
  const city = sede === "bogota" ? "Bogotá" : "Cali";
  return { title: `Servicio técnico en ${city}`, description: `Diagnóstico, reparación y mantenimiento de electrodomésticos en ${city}. Atención a domicilio y en punto físico con Tecnielectrogas.` };
}
export default async function SedePage({ params }: { params: Promise<{ sede: string }> }) {
  const { sede } = await params;
  if (sede !== "bogota" && sede !== "cali") notFound();
  const city = sede === "bogota" ? "Bogotá" : "Cali";
  const other = sede === "bogota" ? "cali" : "bogota";
  return <>
    <Section hero>
      <span className="eyebrow">Sede {city}</span>
      <HeroTitle lead="Te explicamos" rest="antes de reparar." />
      <div className="mt-[clamp(32px,5vw,64px)] grid items-end gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:gap-14">
        <div>
          <p className="lead max-w-xl">Diagnóstico, reparación y mantenimiento de electrodomésticos en {city}. Podemos atender en tu domicilio o recibir tu equipo en el punto físico de la sede.</p>
          <p className="mt-4 text-sm text-gris">La dirección del punto y la disponibilidad se confirman por WhatsApp al agendar.</p>
          <a href="#solicitud" className="btn-primary mt-7">Solicitar servicio en {city}</a>
        </div>
        <BrandPhoto name="explica" tilt="right" priority alt={`Técnico explicando la falla de un equipo a una clienta, referencia para la sede ${city}`} className="mx-auto w-full max-w-sm md:max-w-none" />
      </div>
    </Section>
    <Section>
      <div className="grid gap-5 md:grid-cols-3">
        <div className="card"><h2 className="text-xl font-semibold">Domicilio</h2><p className="mt-3 text-gris">Un técnico se desplaza al lugar indicado después de confirmar la cita.</p></div>
        <div className="card"><h2 className="text-xl font-semibold">En punto físico</h2><p className="mt-3 text-gris">Coordina por WhatsApp la recepción del equipo en la sede.</p></div>
        <div className="card"><h2 className="text-xl font-semibold">Garantía escrita</h2><p className="mt-3 text-gris">30 días, 3 meses o 6 meses, asignados según el trabajo realizado.</p></div>
      </div>
    </Section>
    <Section end id="solicitud" wrapClassName="max-w-3xl">
      <span className="eyebrow">{city}</span>
      <h2 className="section-title">Solicita atención en esta sede</h2>
      <p className="mb-7 mt-3 text-gris">Enviaremos el detalle a WhatsApp. La cita y el técnico se asignan después de confirmar contigo.</p>
      <ContactForm sede={sede as Sede} enabledSedes={{ bogota: /^\d{10,15}$/.test(process.env.WHATSAPP_BOGOTA ?? ""), cali: /^\d{10,15}$/.test(process.env.WHATSAPP_CALI ?? "") }} />
      <p className="mt-5 text-sm text-gris">¿Buscas la otra sede? <Link href={`/sedes/${other}`} className="font-semibold text-accent underline">Ver {other === "cali" ? "Cali" : "Bogotá"}</Link></p>
    </Section>
  </>;
}
