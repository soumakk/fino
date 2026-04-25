import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z.email().min(1, "Email is required"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(8, "Password is too short"),
});
export type ILoginForm = z.infer<typeof LoginFormSchema>;

export const SignupFormSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email().min(1, "Email is required"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(8, "Password is too short"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });
export type ISignupForm = z.infer<typeof SignupFormSchema>;
