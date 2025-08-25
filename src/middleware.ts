import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized({ req, token }) {
        const { pathname } = req.nextUrl;
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register"
        )
          return true;
        if (pathname.startsWith("/") || pathname === "/api/video") return true;

        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/data (SSG data cache)
     * - public files (public folder)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/data|public|favicon.ico).*)",
  ],
};
