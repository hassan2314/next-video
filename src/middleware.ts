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

        // Public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/"
        ) {
          return true;
        }

        // ✅ Allow only GET for /api/video
        if (pathname === "/api/video" && req.method === "GET") {
          return true;
        }

        // ✅ Otherwise require login
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/data|public|favicon.ico).*)"],
};
