"use client";
import { useEffect, useRef } from "react";

const NS = "http://www.w3.org/2000/svg";

function roundedPath(pts: number[][], radius: number) {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1];
    const l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1);
    if (!l1 || !l2) continue;
    const r = Math.min(radius, l1 / 2, l2 / 2);
    d += ` L${(x1 - ((x1 - x0) / l1) * r).toFixed(1)} ${(y1 - ((y1 - y0) / l1) * r).toFixed(1)} Q${x1} ${y1} ${(x1 + ((x2 - x1) / l2) * r).toFixed(1)} ${(y1 + ((y2 - y1) / l2) * r).toFixed(1)}`;
  }
  const e = pts[pts.length - 1];
  return `${d} L${e[0]} ${e[1]}`;
}

/**
 * El cable del manual de marca: nace en el punto (#brand-start) del titular, corre por los
 * márgenes, cruza entre secciones y se dibuja con el scroll. Cierra con el check del logo.
 * Secciones: [data-brand-section]; secciones oscuras: [data-brand-dark] (el cable pasa a cobre claro).
 */
export function BrandProgressLine() {
  const layer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layerEl = layer.current;
    const host = layerEl?.parentElement;
    const svg = layerEl?.querySelector("svg");
    if (!layerEl || !host || !svg) return;
    const clip = svg.querySelector("clipPath") as SVGClipPathElement;
    const get = (k: string) => svg.querySelector(`[data-k="${k}"]`) as SVGPathElement;
    const ghostL = get("ghost-l"), ghostD = get("ghost-d"), lineL = get("line-l"), lineD = get("line-d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let total = 0, samples: number[][] = [], raf = 0, timer = 0;

    const build = () => {
      const hr = host.getBoundingClientRect();
      const w = host.clientWidth, h = host.offsetHeight;
      svg.setAttribute("width", String(w)); svg.setAttribute("height", String(h)); svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const wrap = host.querySelector<HTMLElement>(".wrap");
      if (!wrap) return;
      const wr = wrap.getBoundingClientRect();
      const pad = parseFloat(getComputedStyle(wrap).paddingLeft) || 44;
      const xL = Math.max(14, wr.left - hr.left + pad * 0.42), xR = Math.min(w - 14, wr.right - hr.left - pad * 0.42);
      const small = w < 600, sw = small ? 6 : 12;
      [ghostL, ghostD, lineL, lineD].forEach(p => { p.setAttribute("stroke-width", String(sw)); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); p.setAttribute("fill", "none"); });

      const dot = host.querySelector<HTMLElement>("#brand-start");
      let pts: number[][];
      if (dot) { const s = dot.getBoundingClientRect(); const sx = s.left - hr.left + s.width / 2, sy = s.top - hr.top + s.height / 2; pts = [[sx, sy], [xR, sy]]; }
      else pts = [[xR, 0], [xR, 1]];

      const sections = [...host.querySelectorAll<HTMLElement>("[data-brand-section]")].filter(s => !(dot && s.contains(dot)));
      let side: "R" | "L" = "R";
      sections.forEach((sec, i) => {
        const r = sec.getBoundingClientRect(), top = r.top - hr.top;
        const y = top + Math.min(64, r.height * 0.1), x = side === "R" ? xR : xL;
        pts.push([x, y]);
        side = side === "R" ? "L" : "R";
        const nx = side === "R" ? xR : xL;
        pts.push([nx, y]);
        if (i === sections.length - 1) {
          // Cierre: baja por el margen, cruza bajo el contenido y termina en el check del logo
          const u = small ? 34 : 56, cx = w / 2, yy = r.bottom - hr.top - (small ? 110 : 140);
          pts.push([nx, yy], [cx - u * 0.9, yy], [cx - u * 0.25, yy], [cx + u * 0.05, yy + u * 0.38], [cx + u * 0.85, yy - u * 0.62]);
        }
      });

      const d = roundedPath(pts, small ? 26 : 46);
      [ghostL, ghostD, lineL, lineD].forEach(p => p.setAttribute("d", d));
      clip.innerHTML = "";
      host.querySelectorAll<HTMLElement>("[data-brand-dark]").forEach(el => {
        const r = el.getBoundingClientRect(), rect = document.createElementNS(NS, "rect");
        rect.setAttribute("x", "0"); rect.setAttribute("y", String(r.top - hr.top)); rect.setAttribute("width", String(w)); rect.setAttribute("height", String(r.height));
        clip.appendChild(rect);
      });
      total = lineL.getTotalLength();
      samples = [];
      for (let l = 0; l <= total; l += 24) samples.push([l, lineL.getPointAtLength(l).y]);
      samples.push([total, lineL.getPointAtLength(total).y]);
      [lineL, lineD].forEach(p => { p.style.strokeDasharray = `${total} ${total}`; });
      draw();
    };

    const draw = () => {
      if (!total) return;
      const hostTop = host.getBoundingClientRect().top + window.scrollY;
      const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4;
      const target = window.scrollY + window.innerHeight * 0.62 - hostTop;
      let len = 0;
      for (const [l, y] of samples) { if (y <= target) len = l; else break; }
      if (reduce.matches || atEnd) len = total;
      const off = String(total - len);
      lineL.style.strokeDashoffset = off; lineD.style.strokeDashoffset = off;
    };

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; draw(); }); };
    const rebuild = () => { window.clearTimeout(timer); timer = window.setTimeout(build, 100); };
    const ro = new ResizeObserver(rebuild);
    ro.observe(host);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", rebuild);
    window.addEventListener("load", build);
    reduce.addEventListener("change", draw);
    document.fonts?.ready.then(build);
    build();
    return () => { ro.disconnect(); cancelAnimationFrame(raf); window.clearTimeout(timer); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", rebuild); window.removeEventListener("load", build); reduce.removeEventListener("change", draw); };
  }, []);

  return <div ref={layer} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
    <svg className="absolute left-0 top-0" fill="none">
      <defs><clipPath id="brand-dark-clip" /></defs>
      <path data-k="ghost-l" stroke="#DFE5E7" />
      <g clipPath="url(#brand-dark-clip)"><path data-k="ghost-d" stroke="#33444C" /></g>
      <path data-k="line-l" stroke="#A8582F" />
      <g clipPath="url(#brand-dark-clip)"><path data-k="line-d" stroke="#E0975F" /></g>
    </svg>
  </div>;
}
