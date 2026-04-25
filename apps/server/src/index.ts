import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";

import authRoutes from "./routes/auth.route.js";
import categoryRoutes from "./routes/category.route.js";
import transactionRoutes from "./routes/transaction.route.js";
import dashboardRoutes from "./routes/dashboard.route.js";

const app = new Hono();
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

app.use(logger());
app.use("/api/*", cors());

app.route("/api/auth", authRoutes);
app.route("/api/transactions", transactionRoutes);
app.route("/api/categories", categoryRoutes);
app.route("/api/dashboard", dashboardRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ message: err.message }, err.status);
  }

  return c.json({ message: "Internal server error" }, 500);
});

serve(
  {
    fetch: app.fetch,
    port: port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);
