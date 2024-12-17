import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

import { TeamsCollection } from "../teams/collection";
import { UsersCollection } from "../users/collection";
import { authSignUpSchema } from "./schemas";

export const authModule = createModule("auth")
  .addMethod("signUp", authSignUpSchema, async ({ email, password }) => {
    try {
      const userId = await Accounts.createUserAsync({ email, password });

      const user = await UsersCollection.findOneAsync({ _id: userId });

      const teamId = await TeamsCollection.insertAsync({
        name: `${user?.profile?.name || email.split("@")[0] || "User"}'s Team`,
        ownerId: userId,
        members: [
          {
            _id: userId,
            email: user?.emails?.[0]?.address || "",
            name: user?.profile?.name || email.split("@")[0] || "",
            createdAt: user?.createdAt
          }
        ],
        createdAt: new Date()
      });

      return { userId, teamId };
    } catch (e) {
      const error = e as Meteor.Error;
      throw new Meteor.Error(error.message);
    }
  })
  .buildSubmodule();
