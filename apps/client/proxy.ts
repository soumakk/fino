import { NextRequest, NextResponse } from "next/server";

const authPages = ["/login", "/signup", "/verify-email"];

export function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;
  const isAuthPage = authPages?.some((page) =>
    req.nextUrl.pathname.startsWith(page),
  );

  if (!accessToken && !refreshToken) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
