import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const plexSans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-plex-sans", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-mono", display: "swap" });

export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover", themeColor: "#F5F2EC" };
export const metadata: Metadata = { title: { default: "Tecnielectrogas | Servicio técnico de electrodomésticos", template: "%s | Tecnielectrogas" }, description: "Solicita diagnóstico, reparación y mantenimiento de electrodomésticos en Bogotá y Cali.", applicationName: "Tecnielectrogas", robots: { index: true, follow: true }, openGraph: { type: "website", locale: "es_CO", siteName: "Tecnielectrogas", title: "Tecnielectrogas | Servicio técnico de electrodomésticos", description: "Diagnóstico, reparación y mantenimiento en Bogotá y Cali." } };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="es-CO" className={`${plexSans.variable} ${plexMono.variable}`}><body>{children}</body></html>;
}
