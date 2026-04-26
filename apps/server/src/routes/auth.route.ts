import { sendVerificationEmail } from "@/lib/email.js";
import prisma from "@/lib/prisma.js";
import { zValidator } from "@hono/zod-validator";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { LoginSchema, SignupSchema } from "../schema/auth.schema.js";
import { sign } from "hono/jwt";
import { hashToken } from "@/lib/utils.js";
import { authMiddlware } from "@/middlewares/auth.middleware.js";

const app = new Hono();

app.post("/signup", zValidator("json", SignupSchema), async (c) => {
  const { email, name, password } = c.req.valid("json");

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new HTTPException(409, { message: "Emaill aleady in use" });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // create the user
  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationExpiry,
    },
  });

  // send verification email
  await sendVerificationEmail(name, email, verificationToken);

  return c.json({ message: "Signup Successful" });
});

app.post("/verify-email", async (c) => {
  const { token } = await c.req.json();

  if (!token) {
    throw new HTTPException(400, { message: "Token is required" });
  }

  // find the user with token
  const user = await prisma.user.findFirst({
    where: {
      verificationToken: token,
      verificationExpiry: { gt: new Date() }, // expiry should be greater than now
    },
  });

  if (!user) {
    throw new HTTPException(400, { message: "Invalid or expired token" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isVerified: true,
      verificationToken: null,
      verificationExpiry: null,
    },
  });

  return c.json({ message: "Email verified successfully", success: true });
});

app.post("/login", zValidator("json", LoginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      password: true,
      isVerified: true,
      email: true,
      name: true,
    },
  });

  if (!user) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    throw new HTTPException(403, {
      message: "Please verify email before login",
    });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    throw new HTTPException(401, { message: "Invalid credentials" });
  }

  // create access token
  const accessToken = await sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15min
    },
    process.env.JWT_SECRET!,
    "HS256",
  );

  // refresh token
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const hashedRefreshToken = hashToken(refreshToken);

  await prisma.refreshToken.create({
    data: {
      token: hashedRefreshToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7days
      userId: user.id,
    },
  });

  return c.json({
    accessToken,
    refreshToken,
  });
});

app.post("/refresh", async (c) => {
  const { token } = await c.req.json();

  if (!token) {
    throw new HTTPException(401, { message: "No refresh token" });
  }

  const hashedToken = hashToken(token);
  const storedToken = await prisma.refreshToken.findFirst({
    where: {
      token: hashedToken,
    },
    include: { user: true },
  });

  if (!storedToken) {
    throw new HTTPException(401, { message: "Invalid refresh token" });
  }

  if (storedToken.revoked) {
    await prisma.refreshToken.updateMany({
      where: { userId: storedToken.userId },
      data: { revoked: true },
    });
    throw new HTTPException(401, { message: "Token reuse detected" });
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });
    throw new HTTPException(401, { message: "Expired refresh token" });
  }

  // generate new tokens
  const accessToken = await sign(
    {
      id: storedToken.userId,
      email: storedToken.user.email,
      name: storedToken.user.name,
      exp: Math.floor(Date.now() / 1000) + 15 * 60, // 15min
    },
    process.env.JWT_SECRET!,
    "HS256",
  );

  // refresh token
  const refreshToken = crypto.randomBytes(32).toString("hex");
  const hashedRefreshToken = hashToken(refreshToken);

  await prisma.$transaction([
    prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    }),
    prisma.refreshToken.create({
      data: {
        token: hashedRefreshToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7days
        userId: storedToken.userId,
      },
    }),
  ]);

  return c.json({
    accessToken,
    refreshToken,
  });
});

app.post("/logout", authMiddlware, async (c) => {
  const { token } = await c.req.json();

  if (token) {
    const storedToken = await prisma.refreshToken.findFirst({
      where: { token },
    });

    if (storedToken) {
      await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true },
      });
    }
  }

  c.json({ success: true });
});

export default app;
