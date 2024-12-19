import "dotenv/config";

import { createModule } from "grubba-rpc";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { Random } from "meteor/random";
import { ServiceConfiguration } from "meteor/service-configuration";

import { authModule } from "/imports/api/auth/methods";
import { TeamsCollection } from "/imports/api/teams/collection";
import { teamsModule } from "/imports/api/teams/methods";
import { usersModule } from "/imports/api/users/methods";

Meteor.startup(async () => {});

const server = createModule()
  .addSubmodule(usersModule)
  .addSubmodule(authModule)
  .addSubmodule(teamsModule)
  .build();
export type Server = typeof server;

await ServiceConfiguration.configurations.upsertAsync(
  { service: "google" },
  {
    $set: {
      loginStyle: "popup",
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      secret: process.env.GOOGLE_OAUTH_SECRET
    }
  }
);

await ServiceConfiguration.configurations.upsertAsync(
  { service: "github" },
  {
    $set: {
      loginStyle: "popup",
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      secret: process.env.GITHUB_OAUTH_SECRET
    }
  }
);

interface GoogleService {
  email: string;
  name?: string;
}

interface GithubService {
  email: string;
  name?: string;
  username?: string;
}

interface UserServices {
  password?: {
    bcrypt: string;
  };
  google?: GoogleService;
  github?: GithubService;
}

interface UserProfile {
  name?: string;
}

interface UserOptions {
  email?: string;
  profile?: UserProfile;
}

interface User {
  _id?: string;
  services?: UserServices;
  emails?: Array<{ address: string; verified: boolean }>;
  teams?: string[];
}

Accounts.onCreateUser(async (options: UserOptions, user: User): Promise<User> => {
  user._id = Random.id();
  let email: string | undefined;
  let name: string;

  if (user.services?.password) {
    email = options.email;
    name = options.profile?.name ?? email?.split("@")[0] ?? "User";
  } else if (user.services?.google) {
    email = user.services.google.email;
    name = user.services.google.name ?? email?.split("@")[0] ?? "User";
  } else if (user.services?.github) {
    email = user.services.github.email;
    name =
      user.services.github.name ?? user.services.github.username ?? email?.split("@")[0] ?? "User";
  } else {
    throw new Error("Unsupported authentication service");
  }

  try {
    const teamId = await TeamsCollection.insertAsync({
      name: `${name}'s Team`,
      ownerId: user._id,
      members: [{ _id: user._id, joinedAt: new Date() }],
      createdAt: new Date()
    });

    user.teams = [teamId];
  } catch (error) {
    console.error("Error creating team:", error);
  }

  return user;
});
