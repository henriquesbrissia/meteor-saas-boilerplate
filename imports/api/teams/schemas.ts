import { z } from "zod";

export const memberSchema = z.object({
  _id: z.string(),
  email: z.string().email().optional(),
  name: z.string().optional(),
  createdAt: z.union([z.date(), z.string()]).optional()
});

export const teamSchema = z.object({
  _id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  members: z.array(memberSchema),
  createdAt: z.union([z.date(), z.string()]).optional()
});

export const createTeamSchema = z.object({
  name: z.string()
});

export const getUserTeamsSchema = z.object({
  _id: z.string()
});

export type CreateTeamValues = z.infer<typeof createTeamSchema>;

export type TeamValues = z.infer<typeof teamSchema>;
