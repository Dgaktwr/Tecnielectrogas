import { cn } from "@/lib/utils";
export function ImagePlaceholder({ className, label }: { className?: string; label?: string }) {
  return (
    <div role="img" aria-label={label ?? "Imagen pendiente"}
      className={cn("relative w-full overflow-hidden rounded-lg border border-slate-300 bg-slate-100", className ?? "aspect-video")}>
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
        <line x1="0" y1="0" x2="100" y2="100" stroke="#94a3b8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#94a3b8" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
