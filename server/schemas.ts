import { z } from "zod";

export const GoogleServiceSchema = z.object({
  email: z.string(),
  name: z.string().optional()
});

export const GithubServiceSchema = z.object({
  email: z.string(),
  name: z.string().optional(),
  username: z.string().optional()
});

export const UserServicesSchema = z.object({
  password: z.object({
    bcrypt: z.string()
  }).optional(),
  google: GoogleServiceSchema.optional(),
  github: GithubServiceSchema.optional()
});

export const UserProfileSchema = z.object({
  name: z.string().optional()
});

export const UserOptionsSchema = z.object({
  email: z.string().optional(),
  profile: UserProfileSchema.optional()
});

export const UserSchema = z.object({
  _id: z.string().optional(),
  services: UserServicesSchema.optional(),
  emails: z.array(
    z.object({
      address: z.string(),
      verified: z.boolean()
    })
  ).optional(),
  teams: z.array(z.string()).optional()
});

export type GoogleService = z.infer<typeof GoogleServiceSchema>;
export type GithubService = z.infer<typeof GithubServiceSchema>;
export type UserServices = z.infer<typeof UserServicesSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type UserOptions = z.infer<typeof UserOptionsSchema>;
export type User = z.infer<typeof UserSchema>; 