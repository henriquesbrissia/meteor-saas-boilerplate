import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { ServiceConfiguration } from "meteor/service-configuration";

import { authModule } from "/imports/api/auth/methods";
import { checkoutModule } from "/imports/api/checkout/methods";
import { TeamsCollection } from "/imports/api/teams/collection";
import { teamsModule } from "/imports/api/teams/methods";
import { usersModule } from "/imports/api/users/methods";
import { User, UserOptionsSchema, UserSchema } from "./schemas";

Meteor.startup(async () => {});

const server = createModule()
  .addSubmodule(usersModule)
  .addSubmodule(authModule)
  .addSubmodule(teamsModule)
  .addSubmodule(checkoutModule)
  .build();
export type Server = typeof server;

await ServiceConfiguration.configurations.upsertAsync(
  { service: "google" },
  {
    $set: {
      loginStyle: "popup",
      clientId: Meteor.settings.GOOGLE_OAUTH_CLIENT_ID as string,
      secret: Meteor.settings.GOOGLE_OAUTH_SECRET as string
    }
  }
);

await ServiceConfiguration.configurations.upsertAsync(
  { service: "github" },
  {
    $set: {
      loginStyle: "popup",
      clientId: Meteor.settings.GITHUB_OAUTH_CLIENT_ID as string,
      secret: Meteor.settings.GITHUB_OAUTH_SECRET as string
    }
  }
);

Accounts.onCreateUser(async (options, user): Promise<User> => {
  const optionsResult = UserOptionsSchema.safeParse(options);
  const userResult = UserSchema.safeParse(user);
  
  if (!optionsResult.success) {
    console.error("Invalid user options:", optionsResult.error);
    throw new Meteor.Error("validation-error", "Dados de opções de usuário inválidos");
  }
  
  if (!userResult.success) {
    console.error("Invalid user data:", userResult.error);
    throw new Meteor.Error("validation-error", "Dados de usuário inválidos");
  }
  
  const validOptions = optionsResult.data;
  const validUser = userResult.data;
  
  validUser._id = Random.id();
  let email: string | undefined;
  let name: string;

  if (validUser.services?.password) {
    email = validOptions.email;
    name = validOptions.profile?.name ?? email?.split("@")[0] ?? "User";
  } else if (validUser.services?.google) {
    email = validUser.services.google.email;
    name = validUser.services.google.name ?? email?.split("@")[0] ?? "User";
  } else if (validUser.services?.github) {
    email = validUser.services.github.email;
    name =
      validUser.services.github.name ?? validUser.services.github.username ?? email?.split("@")[0] ?? "User";
  } else {
    throw new Error("Unsupported authentication service");
  }

  try {
    const teamId = await TeamsCollection.insertAsync({
      name: `${name}'s Team`,
      ownerId: validUser._id,
      members: [{ _id: validUser._id, role: "admin", joinedAt: new Date() }],
      createdAt: new Date()
    });

    validUser.teams = [teamId];
  } catch (error) {
    console.error("Error creating team:", error);
  }

  return validUser;
});
