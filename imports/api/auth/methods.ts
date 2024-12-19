import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

import { authSignUpSchema } from "./schemas";

export const authModule = createModule("auth")
  .addMethod("signUp", authSignUpSchema, async ({ email, password }) => {
    try {
      await Accounts.createUserAsync({ email, password });
    } catch (e) {
      const error = e as Meteor.Error;
      throw new Meteor.Error(error.message);
    }
  })
  .buildSubmodule();
