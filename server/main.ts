import "dotenv/config";

import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";
import { ServiceConfiguration } from "meteor/service-configuration";

import { authModule } from "/imports/api/auth/methods";
import { usersModule } from "/imports/api/users/methods";

Meteor.startup(async () => {});

const server = createModule().addSubmodule(usersModule).addSubmodule(authModule).build();
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
