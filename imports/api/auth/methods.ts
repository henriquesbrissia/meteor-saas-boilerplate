import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { Resend } from "resend";

import { UsersCollection } from "../users/collection";
import { authSignUpSchema, forgotPasswordSchema, resetPasswordPayloadSchema } from "./schemas";

const resendApiKey = Meteor.settings.RESEND_API_KEY as string;
const resend = new Resend(resendApiKey);

export const authModule = createModule("auth")
  .addMethod("signUp", authSignUpSchema, async ({ email, password }) => {
    try {
      await Accounts.createUserAsync({ email, password });
    } catch (e) {
      const error = e as Meteor.Error;
      throw new Meteor.Error(error.message);
    }
  })
  .addMethod("forgotPassword", forgotPasswordSchema, async ({ email }) => {
    const user = await UsersCollection.findOneAsync({ "emails.address": email });
    if (!user) {
      throw new Meteor.Error("User not found with this email.");
    }

    const token = Random.secret();
    const tokenExpiration = new Date(Date.now() + 60 * 60 * 1000);

    await UsersCollection.updateAsync(user._id, {
      $set: {
        "services.password.reset": {
          token,
          tokenExpiration
        }
      }
    });

    const baseUrl = Meteor.settings.BASE_URL as string;
    const resetLink = `${baseUrl}/reset-password?token=${token}`;

    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Password Reset Request",
        html: `
            <p>Hello, ${user.profile.name || "Meteor Boillerplate User"}</p>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetLink}" target="_blank">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
      });
    } catch (e) {
      throw new Meteor.Error("Failed to send reset email. Please try again later.");
    }

    return { message: "Reset email sent successfully." };
  })
  .addMethod("resetPassword", resetPasswordPayloadSchema, async ({ token, newPassword }) => {
    const user = await UsersCollection.findOneAsync({
      "services.password.reset.token": token,
      "services.password.reset.tokenExpiration": { $gte: new Date() }
    });

    if (!user) {
      throw new Meteor.Error("Invalid or expired reset token.");
    }

    await Accounts.setPasswordAsync(user._id, newPassword);

    await UsersCollection.updateAsync(user._id, {
      $unset: { "services.password.reset": "" }
    });

    return { message: "Password reset successfully." };
  })
  .buildSubmodule();
