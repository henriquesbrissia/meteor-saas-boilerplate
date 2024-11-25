import { z } from "zod";

export const authSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
