import { Mongo } from "meteor/mongo";

import type { TeamValues } from "./schemas";

export const TeamsCollection = new Mongo.Collection<TeamValues>("teams");
