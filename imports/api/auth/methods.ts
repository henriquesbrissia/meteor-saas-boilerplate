import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";

import { authSignUpSchema } from "./schemas";

export const authModule = createModule("auth")
  .addMethod("signUp", authSignUpSchema, async ({ email, password }) => {
    try {
      await Accounts.createUserAsync({ email, password });
      console.log("success", password, email);
    } catch (e) {
      const error = e as Meteor.Error;
      console.log("Error signing up", error);
      throw new Meteor.Error(error.message);
    }
  })
  .buildSubmodule();
