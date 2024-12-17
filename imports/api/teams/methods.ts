import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

import { UsersCollection } from "../users/collection";
import { TeamsCollection } from "./collection";
import { createTeamSchema, getUserTeamsSchema } from "./schemas";

export const teamsModule = createModule("teams")
  .addMethod("createTeam", createTeamSchema, async ({ name }) => {
    const userId = Meteor.userId();
    if (!userId) {
      throw new Meteor.Error("not-authorized", "You must be logged in to create a team");
    }
    const user = await UsersCollection.findOneAsync({ _id: userId });

    try {
      const newTeam = await TeamsCollection.insertAsync({
        name,
        ownerId: userId,
        members: [
          {
            _id: userId,
            email: user?.emails?.[0]?.address || "",
            name: user?.profile?.name || user?.emails?.[0]?.address.split("@")[0] || "",
            createdAt: user?.createdAt
          }
        ],
        createdAt: new Date()
      });

      return newTeam;
    } catch (error) {
      console.error("Error inserting team:", error);
      throw new Meteor.Error("insert-failed", "Could not create the team");
    }
  })
  .addMethod("getUserTeams", getUserTeamsSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) throw new Meteor.Error("Not authorized");

    const teams = await TeamsCollection.find({ "members._id": userId }).fetchAsync();
    return teams;
  })
  .buildSubmodule();
