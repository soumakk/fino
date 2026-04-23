import type { TransactionType } from "@/generated/prisma/enums.js";
import prisma from "@/lib/prisma.js";
import { validator } from "@/lib/utils.js";
import { authMiddlware } from "@/middlewares/auth.middleware.js";
import { CreateTransactionSchema } from "@/schema/transaction.schema.js";
import type { AppVariables } from "@/schema/user.schema.js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Variables: AppVariables }>();

app.get("/", authMiddlware, async (c) => {
  try {
    const userId = c.get("userId");

    const data = await prisma.transaction.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });
    return c.json({ data });
  } catch (err) {
    throw new HTTPException(500, { message: "Faled to fetch transactions" });
  }
});

app.get("/:id", authMiddlware, async (c) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("userId");

    const data = await prisma.transaction.findMany({
      where: { id, userId },
      select: {
        category: true,
      },
    });

    return c.json({ data });
  } catch (err) {
    throw new HTTPException(500, { message: "Faled to fetch transaction" });
  }
});

app.post(
  "/",
  authMiddlware,
  validator("json", CreateTransactionSchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const userId = c.get("userId");

      await prisma.transaction.create({
        data: {
          description: body.description,
          amount: body.amount,
          date: new Date(body.date),
          type: body.type as TransactionType,
          categoryId: body.categoryId,
          userId: userId,
        },
      });

      return c.json({ message: "Transaction added successfully" });
    } catch (err) {
      throw new HTTPException(500, { message: "Faled to create transaction" });
    }
  },
);

export default app;
