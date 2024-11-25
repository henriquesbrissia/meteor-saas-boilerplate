import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

import { authModule } from "/imports/api/auth/methods";
import { usersModule } from "/imports/api/users/methods";

Meteor.startup(async () => {});

const server = createModule().addSubmodule(usersModule).addSubmodule(authModule).build();
export type Server = typeof server;
