import { Mongo } from "meteor/mongo";

import type { Team } from "./schemas";

export const TeamsCollection = new Mongo.Collection<Team>("teams");
