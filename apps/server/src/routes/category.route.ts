import prisma from "@/lib/prisma.js";
import { validator } from "@/lib/utils.js";
import { authMiddlware } from "@/middlewares/auth.middleware.js";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/schema/category.schema.js";
import type { AppVariables } from "@/schema/user.schema.js";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const categories = new Hono<{ Variables: AppVariables }>();

categories.post(
  "/",
  authMiddlware,
  validator("json", CreateCategorySchema),
  async (c) => {
    try {
      const userId = c.get("userId");
      const body = await c.req.json();

      const category = await prisma.category.create({
        data: {
          name: body.name,
          color: body.color,
          icon: body.icon,
          type: body.type,
          isDefault: body.isDefault || false,
          userId: body.isDefault ? null : userId,
        },
      });

      return c.json(category, 201);
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to create category" });
    }
  },
);

categories.get("/", authMiddlware, async (c) => {
  try {
    const userId = c.get("userId");

    const userCategories = await prisma.category.findMany({
      where: { OR: [{ userId: userId }, { isDefault: true }] },
      orderBy: { name: "asc" },
    });

    return c.json({ data: userCategories }, 200);
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to fetch categories" });
  }
});

categories.get("/:id", authMiddlware, async (c) => {
  try {
    const id = c.req.param("id");

    const category = await prisma.category.findUnique({
      where: { id: id },
    });

    return c.json({ data: category }, 200);
  } catch (error) {
    throw new HTTPException(500, { message: "Failed to fetch category" });
  }
});

categories.put(
  "/:id",
  authMiddlware,
  validator("json", UpdateCategorySchema),
  async (c) => {
    try {
      const id = c.req.param("id");
      const userId = c.get("userId");
      const body = await c.req.json();

      const updatedCategory = await prisma.category.update({
        where: { id: id },
        data: {
          name: body.name,
          color: body.color,
          icon: body.icon,
          type: body.type,
        },
      });

      return c.json(updatedCategory, 200);
    } catch (error) {
      throw new HTTPException(500, { message: "Failed to update category" });
    }
  },
);

categories.delete("/:id", authMiddlware, async (c) => {
  try {
    const id = c.req.param("id");
    const userId = c.get("userId");

    // Check ownership before deleting
    const existing = await prisma.category.findUnique({
      where: { id, userId, isDefault: false },
    });
    if (!existing) {
      return c.json({ error: "Category not found" }, 404);
    }

    await prisma.category.delete({
      where: { id: id },
    });

    return c.json({ message: "Category deleted successfully" }, 200);
  } catch (error) {
    throw new HTTPException(500, {
      message:
        "Failed to delete category. Make sure no transaction are linked.",
    });
  }
});

export default categories;
