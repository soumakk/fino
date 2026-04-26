import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch (err) {
    return null;
  }
}
