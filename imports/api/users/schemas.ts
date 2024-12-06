import { z } from "zod";

export const usersSchema = z.object({
  _id: z.string(),
  username: z.string().optional(),
  emails: z.array(z.object({ address: z.string().email(), verified: z.boolean() })),
  createdAt: z.date().optional(),
  profile: z.object({ name: z.string(), image: z.string().optional() }),
  services: z
    .object({
      password: z.object({
        bcrypt: z.string()
      }),
      google: z.object({
        accessToken: z.string(),
        email: z.string().email(),
        expiresAt: z.number(),
        family_name: z.string(),
        given_name: z.string(),
        id: z.string(),
        idToken: z.string(),
        name: z.string(),
        picture: z.string(),
        scope: z.string().array(),
        verified_email: z.boolean()
      }),
      github: z.object({
        accessToken: z.string(),
        avatar: z.string(),
        bio: z.string(),
        blog: z.string(),
        company: z.null() || z.string(),
        email: z.string().email(),
        emails: z.array(
          z.object({
            email: z.string().email(),
            primary: z.boolean(),
            verified: z.boolean(),
            visibility: z.string()
          })
        ),
        id: z.number(),
        location: z.string(),
        name: z.string(),
        username: z.string()
      })
    })
    .optional()
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

export const deleteSchema = z.string();

export const passwordSchema = z
  .object({
    oldPassword: z.string().min(8),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8)
  })
  .refine(({ newPassword, confirmPassword }) => newPassword === confirmPassword, {
    message: "password doesn't match",
    path: ["confirmPassword"]
  });

export type PasswordValues = z.infer<typeof passwordSchema>;
