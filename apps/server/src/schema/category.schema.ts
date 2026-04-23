import z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string().optional(),
  type: z.enum(["EXPENSE", "INCOME"]),
  isDefault: z.boolean().default(false).optional(),
});

export const UpdateCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
  icon: z.string().optional(),
  type: z.enum(["EXPENSE", "INCOME"]),
});
