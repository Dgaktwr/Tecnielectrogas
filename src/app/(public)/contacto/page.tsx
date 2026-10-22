import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { Section } from "@/components/public/section";
import { HeroTitle } from "@/components/public/hero-title";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Solicitar servicio", description: "Solicita servicio técnico de electrodomésticos en Bogotá o Cali y continúa la atención por WhatsApp." };
export default function Page() {
  const enabledSedes = { bogota: /^\d{10,15}$/.test(process.env.WHATSAPP_BOGOTA ?? ""), cali: /^\d{10,15}$/.test(process.env.WHATSAPP_CALI ?? "") };
  return <>
    <Section hero>
      <span className="eyebrow">Atención en Bogotá y Cali</span>
      <HeroTitle lead="Cuéntanos" rest="qué le pasa a tu equipo." />
      <p className="lead mt-8 max-w-2xl">Recibimos solicitudes de servicio a domicilio y en punto físico. Comparte los detalles y continúa por WhatsApp; allí confirmaremos disponibilidad, técnico y cita.</p>
    </Section>
    <Section end wrapClassName="max-w-3xl"><ContactForm enabledSedes={enabledSedes} /></Section>
  </>;
}
