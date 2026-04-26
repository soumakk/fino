import { zValidator } from "@hono/zod-validator";
import crypto from "crypto";
import { HTTPException } from "hono/http-exception";

export const hashToken = (token: string) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const validator = (
  target: Parameters<typeof zValidator>[0],
  schema: any,
) => {
  return zValidator(target, schema, (result, c) => {
    if (!result.success) {
      throw new HTTPException(400, {
        message: "Validation failed",
      });
      // return c.json({
      //   message: "Validation failed",
      //   details: result.error.flatten().fieldErrors,
      // });
    }
  });
};
