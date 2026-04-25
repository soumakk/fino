import z from "zod";

export const DashboardDateFilter = z.object({
  from: z.iso.datetime().optional(),
  to: z.iso.datetime().optional(),
});
