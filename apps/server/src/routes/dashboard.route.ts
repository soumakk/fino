import { Prisma } from "@/generated/prisma/client.js";
import type { TransactionWhereInput } from "@/generated/prisma/models.js";
import prisma from "@/lib/prisma.js";
import { validator } from "@/lib/utils.js";
import { authMiddlware } from "@/middlewares/auth.middleware.js";
import { DashboardDateFilter } from "@/schema/dashboard.schema.js";
import type { AppVariables } from "@/schema/user.schema.js";
import dayjs from "dayjs";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

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

// { year: "2022", type: "EXPENSE" }
app.post("/total-amount-by-month", authMiddlware, async (c) => {
  try {
    const userId = c.get("userId");
    const { year = new Date().getFullYear() } = await c.req.json();

    const result = await prisma.$queryRaw`
      select extract(month from t.date) as month, sum(t.amount) as total, t.type
      from transactions t
      where extract(year from t.date) = ${year} AND t."userId" = ${userId}
      group by month, t.type
      `;

    return c.json({ data: result });
  } catch (err) {
    console.log(err);
  }
});

app.post(
  "/expense-by-category",
  authMiddlware,
  validator("json", DashboardDateFilter),
  async (c) => {
    try {
      const userId = c.get("userId");
      const { from, to } = c.req.valid("json");
      const conditions = [
        Prisma.sql`t.type = 'EXPENSE'`,
        Prisma.sql`t."userId" = ${userId}`,
      ];

      if (from) {
        conditions.push(
          Prisma.sql`t.date >= ${dayjs(from).startOf("day").toDate()}`,
        );
      }
      if (to) {
        // 2. Fix: Changed >= to <= for the 'to' date
        conditions.push(
          Prisma.sql`t.date <= ${dayjs(to).endOf("day").toDate()}`,
        );
      }

      const result: any[] = await prisma.$queryRaw`
      select  c.id,c.name,c.icon, c.color, sum(t.amount) as total
      from transactions t
      join categories c
      on t."categoryId" = c.id
      where ${Prisma.join(conditions, " AND ")}
      group by c.id
      `;

      const formattedResult = result?.map((row) => ({
        ...row,
        total: Number(row.total),
      }));

      return c.json({ data: formattedResult });
    } catch (err) {
      console.log(err);
      throw new HTTPException(500, { message: "Internal server error" });
    }
  },
);

export default app;
