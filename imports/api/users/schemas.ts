import { z } from "zod";

export const usersSchema = z.object({
  _id: z.string(),
  username: z.string().optional(),
  emails: z.array(z.object({ address: z.string(), verified: z.boolean() })),
  createdAt: z.date().optional(),
  profile: z.object({ name: z.string(), image: z.string() }),
  services: z.object({})
});

export const usersFindAllSchema = z.undefined();

export const profileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string()
});

export type ProfileValues = Zod.infer<typeof profileSchema>;

export const userSchema = z.undefined();
