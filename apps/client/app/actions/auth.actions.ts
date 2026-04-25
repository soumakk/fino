"use server";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    // call the backend login api
    const res = await fetch(`${process.env.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    // if request fail, return with error
    if (!res.ok) {
      return {
        error: "Invalid credentials. Please try again",
      };
    }

    const data = await res.json();
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15min
    });

    cookieStore.set("refresh_token", data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7days
    });

    redirect("/dashboard");
  } catch (err) {
    if (isRedirectError(err)) throw err; // let Next.js handle it

    return {
      error: "Unable to connect to the server. Please try again later",
    };
  }
}

export async function singupAction(formData: FormData) {
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");

  const res = await fetch(`${process.env.API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data?.message ?? "Failed to signup. Please try again" };
  }

  return {
    success: true,
  };
}

export async function logoutAction() {
  try {
    const cookieStore = await cookies();

    const refreshToken = cookieStore.get("refresh_token")?.value;

    if (refreshToken) {
      await fetch(`${process.env.API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: refreshToken }),
      });
    }

    cookieStore.delete("access_token");
    cookieStore.delete("refresh_token");

    redirect("/login");
  } catch (err) {
    if (isRedirectError(err)) throw err;

    redirect("/login");
  }
}
