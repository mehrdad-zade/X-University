import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { LOGIN_PATH } from "@/lib/useEndpoints";

export async function middleware(request: NextRequest) {
  // Only protect these paths
  const protectedPaths = ["/dashboard", "/profile", "/onboarding"];
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for session cookie (next-auth.session-token for prod, __Secure-next-auth.session-token for HTTPS)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    const signInUrl = new URL(LOGIN_PATH, request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/onboarding/:path*"]
};