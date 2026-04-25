import type { TransactionType } from "@/generated/prisma/enums.js";
import prisma from "@/lib/prisma.js";
import { validator } from "@/lib/utils.js";
import { authMiddlware } from "@/middlewares/auth.middleware.js";
import {
  CreateTransactionSchema,
  FetchTransactionSchema,
} from "@/schema/transaction.schema.js";
import type { AppVariables } from "@/schema/user.schema.js";
import {
  generateFiltersQuery,
  generateSortQuery,
} from "@/utils/transaction.utils.js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono<{ Variables: AppVariables }>();

// {
//   sort: {
//     path: "amount",
//     "direction": "asc",
//   },
//   filters: {
//     type: "INCOME",
//       category:[ "id"],
//       date: [start, end],
//       search: "asdfasdfads",
//       price: [500, 300]
//   },
//   page: 1,
//   limit: 20
// }
// Fetch all transactions
app.post(
  "/",
  authMiddlware,
  validator("json", FetchTransactionSchema),
  async (c) => {
    try {
      const body = c.req.valid("json");
      const userId = c.get("userId");
      const { filters, sort, page = 1, limit = 5 } = body;

      const whereQuery = { userId, ...generateFiltersQuery(filters) };
      const orderByQuery = generateSortQuery(sort);
      const [transactions, totalCount] = await prisma.$transaction([
        prisma.transaction.findMany({
          where: whereQuery,
          select: {
            id: true,
            description: true,
            date: true,
            amount: true,
            type: true,
            userId: true,
            category: {
              select: {
                id: true,
                name: true,
                color: true,
                icon: true,
              },
            },
          },
          orderBy: orderByQuery,
          take: limit,
          skip: (page - 1) * limit,
        }),
        prisma.transaction.count({
          where: whereQuery,
        }),
      ]);
      return c.json({
        data: transactions,
        metadata: {
          total: totalCount,
          pages: Math.floor(totalCount / limit),
          page: page,
          limit,
        },
      });
    } catch (err) {
      throw new HTTPException(500, { message: "Faled to fetch transactions" });
    }
  },
);

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
  "/create",
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
