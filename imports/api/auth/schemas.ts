import { z } from "zod";

export const authSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export type AuthValues = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "password doesn't match",
    path: ["confirmPassword"]
  });

export type CreateUserValues = Zod.infer<typeof signUpSchema>;
