import z from "zod";

export const SignupSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().regex(/[a-zA-Z0-9]/),
});

export const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});
