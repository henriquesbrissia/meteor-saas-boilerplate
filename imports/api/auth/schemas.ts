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

export const twoFactorForm = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  onSuccess: z.function()
});

export type TwoFactorFormProps = z.infer<typeof twoFactorForm>;

export const twofaSchema = z.object({
  twofaCode: z.string().min(1, "2FA code is required")
});

export type TwoFaFormValues = z.infer<typeof twofaSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address")
});

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string(),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: "password doesn't match",
    path: ["confirmPassword"]
  });

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

export const resetPasswordPayloadSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(8)
});

export type ResetPasswordPayloadValues = z.infer<typeof resetPasswordPayloadSchema>;

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
