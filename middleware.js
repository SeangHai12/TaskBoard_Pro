import { NextResponse } from "next/server";

function isAuthed(req) {
  const auth = req.cookies.get("tbp_auth")?.value === "1";
  const userId = Number(req.cookies.get("tbp_uid")?.value || "");
  return auth && userId > 0 && !Number.isNaN(userId);
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Allow Next.js internals and static assets.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap")
  ) {
    return NextResponse.next();
  }

  // Allow the login page and auth endpoints without a session.
  if (pathname === "/login" || pathname === "/signup" || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Protect all API routes and all pages "before anything".
  if (!isAuthed(req)) {
    if (pathname.startsWith("/api")) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};

