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

export const teamIdSchema = z.object({
  teamId: z.string()
});

export const removeMemberSchema = z.object({
  teamId: z.string(),
  memberId: z.string()
});

export const removeMemberDialog = z.object({
  teamId: z.string(),
  memberId: z.string(),
  memberName: z.string()
});

export type TeamIdValues = z.infer<typeof teamIdSchema>;

export type AddMemberValues = z.infer<typeof addMemberSchema>;

export type RemoveMemberValues = z.infer<typeof removeMemberSchema>;

export type RemoveMemberDialogProps = z.infer<typeof removeMemberDialog>;

export type CreateTeamValues = z.infer<typeof createTeamSchema>;

export type EditTeamValues = z.infer<typeof editTeamSchema>;

export type TeamValues = z.infer<typeof teamSchema>;
