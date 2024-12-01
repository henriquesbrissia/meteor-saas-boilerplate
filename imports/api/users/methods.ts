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
    return user;
  })
  .addMethod("deleteAccount", deleteSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("Not authorized");
    }
    await UsersCollection.removeAsync(userId);
  })
  .buildSubmodule();
