import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { BrandProgressLine } from "@/components/public/brand-progress-line";
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (<><SiteHeader /><main className="relative"><BrandProgressLine />{children}</main><SiteFooter /></>);
}
