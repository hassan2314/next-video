import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // If user is logged in and tries to access /login or /register -> redirect
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/", req.url)); // redirect to homepage (or dashboard)
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async authorized({ req, token }) {
        const { pathname } = req.nextUrl;

        // Public routes
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/register" ||
          pathname === "/" ||
          pathname === "/about" ||
          pathname === "/forgot-password" ||
          pathname === "/reset-password" ||
          pathname.startsWith("/videos/") ||
          pathname.startsWith("/channel/") ||
          pathname.startsWith("/api/test-db") ||
          pathname === "/opengraph-image" ||
          pathname === "/icon" ||
          pathname === "/apple-icon"
        ) {
          return true;
        }

        // Anyone watching a clip can record a view.
        if (
          req.method === "POST" &&
          /^\/api\/videos\/[^/]+\/view$/.test(pathname)
        ) {
          return true;
        }

        // ✅ Allow only GET for /api/video
        if (
          pathname === "/api/video" ||
          pathname.startsWith("/api/videos/") ||
          pathname.startsWith("/api/channel/")
        ) {
          if (req.method === "GET") return true;
        }

        // ✅ Otherwise require login
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|mp4|webm)$).*)",
  ],
};
