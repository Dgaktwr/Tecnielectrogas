import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap { const base = process.env.NEXT_PUBLIC_SITE_URL; if (!base) return []; return ["", "/servicios", "/cobertura", "/sedes/bogota", "/sedes/cali", "/nosotros", "/contacto"].map(path => ({ url: `${base}${path}`, changeFrequency: "monthly" as const, priority: path ? 0.7 : 1 })); }
