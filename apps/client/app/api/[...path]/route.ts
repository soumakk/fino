import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
};

async function handler(req: NextRequest) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const path = req.nextUrl.pathname.replace("/api/", "/");
  const search = req.nextUrl.search;

  // read body once — stream can only be consumed once
  const body = req.method !== "GET" ? await req.text() : undefined;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
  };

  const res = await fetch(`${process.env.API_URL}${path}${search}`, {
    method: req.method,
    headers,
    body,
  });

  if (res.status === 401) {
    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: refreshToken }),
    });

    if (!refreshRes.ok) {
      // clear cookies on the response directly
      const errResponse = NextResponse.json(
        { error: "Session expired" },
        { status: 401 },
      );
      errResponse.cookies.delete("access_token");
      errResponse.cookies.delete("refresh_token");
      return errResponse;
    }

    const { accessToken: newAccess, refreshToken: newRefresh } =
      await refreshRes.json();

    // retry original request with new access token
    const retryRes = await fetch(`${process.env.API_URL}${path}${search}`, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccess}`,
      },
      body, // reuse the already-read body
    });

    const retryData = await retryRes.json();
    const response = NextResponse.json(retryData, { status: retryRes.status });

    // set new cookies on the response object
    response.cookies.set("access_token", newAccess, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 15,
    });
    response.cookies.set("refresh_token", newRefresh, {
      ...COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const DELETE = handler;
