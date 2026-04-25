import type { TransactionWhereInput } from "@/generated/prisma/models.js";
import prisma from "@/lib/prisma.js";
import { validator } from "@/lib/utils.js";
import { authMiddlware } from "@/middlewares/auth.middleware.js";
import { DashboardDateFilter } from "@/schema/dashboard.schema.js";
import type { AppVariables } from "@/schema/user.schema.js";
import { Hono } from "hono";

const app = new Hono<{ Variables: AppVariables }>();

app.post(
  "/summary",
  authMiddlware,
  validator("json", DashboardDateFilter),
  async (c) => {
    const userId = c.get("userId");
    const { from, to } = c.req.valid("json");

    const where: TransactionWhereInput = {
      userId,
      ...(from || to
        ? {
            date: {
              ...(from && { gte: new Date(from) }),
              ...(to && { lte: new Date(to) }),
            },
          }
        : {}),
    };

    const result = await prisma.transaction.groupBy({
      by: ["type"],
      where,
      _sum: { amount: true },
    });

    const income =
      result.find((r) => r.type === "INCOME")?._sum.amount?.toNumber() ?? 0;
    const expense =
      result.find((r) => r.type === "EXPENSE")?._sum.amount?.toNumber() ?? 0;

    return c.json({
      data: {
        income,
        expense,
        balance: income - expense,
      },
    });
  },
);

export default app;
