import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

import { UsersCollection } from "./collection";
import { deleteSchema, profileSchema, userSchema, usersFindAllSchema } from "./schemas";

export const usersModule = createModule("users")
  .addMethod("findAll", usersFindAllSchema, async () => {
    const users = await UsersCollection.find().fetchAsync();
    return users;
  })
  .addMethod("updateProfile", profileSchema, async ({ name, email, userId, image }) => {
    await UsersCollection.updateAsync(userId, {
      $set: { profile: { name, image }, "emails.0.address": email }
    });
  })
  .addMethod("loggedUser", userSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("Not authorized");
    }
    const user = await UsersCollection.findOneAsync({ _id: userId });
    return {
      _id: user?._id,
      hasPassword: !!user?.services?.password,
      hasTwoFAEnabled: !!user?.services?.twoFactorAuthentication?.type,
      profile: user?.profile,
      emails: user?.emails,
      githubEmail: user?.services?.github?.email,
      githubName: user?.services?.github?.name,
      googleEmail: user?.services?.google?.email,
      googleName: user?.services?.google?.name,
      githubImage: user?.services?.github?.avatar,
      googleImage: user?.services?.google?.picture
    };
  })
  .addMethod("deleteAccount", deleteSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("Not authorized");
    }
    await UsersCollection.removeAsync(userId);
  })
  .buildSubmodule();
