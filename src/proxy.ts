import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/api/admin")) return NextResponse.next();
  const user = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASSWORD;
  if (!user || !password) {
    const localHost = ["localhost", "127.0.0.1", "::1"].includes(request.nextUrl.hostname);
    if (process.env.NODE_ENV === "development" && localHost) {
      const response = NextResponse.next();
      response.headers.set("Cache-Control", "no-store");
      return response;
    }
    return new NextResponse("Panel administrativo no configurado", { status: 503, headers: { "Cache-Control": "no-store" } });
  }
  const authorization = request.headers.get("authorization");
  if (authorization?.startsWith("Basic ")) {
    try {
      const decoded = atob(authorization.slice(6));
      if (decoded === `${user}:${password}`) { const response = NextResponse.next(); response.headers.set("Cache-Control", "no-store"); return response; }
    } catch { /* Credenciales mal formadas */ }
  }
  return new NextResponse("Autenticación requerida", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Tecnielectrogas Admin"', "Cache-Control": "no-store" } });
}
export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
