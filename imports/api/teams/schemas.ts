import { z } from "zod";

export const teamSchema = z.object({
  _id: z.string(),
  name: z.string(),
  ownerId: z.string(),
  members: z.array(z.object({ _id: z.string(), joinedAt: z.date() })),
  createdAt: z.union([z.date(), z.string()]).optional()
});

export const createTeamSchema = z.object({
  name: z.string()
});

export const editTeamSchema = z.object({
  teamId: z.string(),
  name: z.string()
});

export const getUserTeamsSchema = z.object({
  _id: z.string()
});

export const addMemberSchema = z.object({
  teamId: z.string(),
  email: z.string().email()
});

export const TeamIdSchema = z.object({
  teamId: z.string()
});

export type TeamIdValues = z.infer<typeof TeamIdSchema>;

export type AddMemberValues = z.infer<typeof addMemberSchema>;

export type CreateTeamValues = z.infer<typeof createTeamSchema>;

export type EditTeamValues = z.infer<typeof editTeamSchema>;

export type TeamValues = z.infer<typeof teamSchema>;
