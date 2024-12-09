import { z } from "zod";

export const teamSchema = z.object({
  _id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  members: z.array(z.string()),
  createdAt: z.date().default(() => new Date())
});

export const createTeamSchema = z.object({
  name: z.string(),
  userId: z.string()
});

export const addMemberSchema = z.object({
  teamId: z.string(),
  userId: z.string()
});

export type Team = z.infer<typeof teamSchema>;
