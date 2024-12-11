import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

import { TeamsCollection } from "../teams/collection";
import { authSignUpSchema } from "./schemas";

export const authModule = createModule("auth")
  .addMethod("signUp", authSignUpSchema, async ({ email, password }) => {
    try {
      const userId = await Accounts.createUserAsync({ email, password });

      const teamId = await TeamsCollection.insertAsync({
        name: `${email.split("@")[0]}'s Team`,
        ownerId: userId,
        members: [userId],
        createdAt: new Date()
      });

      return { userId, teamId };
    } catch (e) {
      const error = e as Meteor.Error;
      throw new Meteor.Error(error.message);
    }
  })
  .buildSubmodule();
