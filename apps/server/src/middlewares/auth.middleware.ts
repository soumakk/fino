import type { AppVariables } from "@/schema/user.schema.js";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import { verify } from "hono/jwt";

export const authMiddlware = createMiddleware<{ Variables: AppVariables }>(
  async (c, next) => {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new HTTPException(401, { message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const payload = await verify(token, process.env.JWT_SECRET!, "HS256");
      c.set("userId", payload.id as string);
      await next();
    } catch (err) {
      throw new HTTPException(401, { message: "Invalid or expired token" });
    }
  },
);
