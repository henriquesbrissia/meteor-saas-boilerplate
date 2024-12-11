import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

import { TeamsCollection } from "./collection";
import { addMemberSchema, createTeamSchema, teamSchema } from "./schemas";

export const teamsModule = createModule("teams")
  .addMethod("createTeam", createTeamSchema, async ({ name, userId }) => {
    if (!userId) throw new Meteor.Error("Not authorized");

    const teamId = await TeamsCollection.insertAsync({
      name,
      ownerId: userId,
      members: [userId],
      createdAt: new Date()
    });

    return { teamId };
  })
  .addMethod("addMember", addMemberSchema, async ({ teamId, userId }) => {
    if (!teamId || !userId) {
      throw new Meteor.Error("Invalid input");
    }

    const team = await TeamsCollection.findOneAsync({ _id: teamId });
    if (!team) throw new Meteor.Error("Team not found");
    if (team.ownerId !== userId) {
      throw new Meteor.Error("Not authorized to add members");
    }

    await TeamsCollection.updateAsync(teamId, { $addToSet: { members: userId } });
  })
  .addMethod("getUserTeams", teamSchema, async ({ _id: userId }) => {
    if (!userId) throw new Meteor.Error("Not authorized");
    const teams = await TeamsCollection.find({ members: userId }).fetchAsync();
    return teams;
  })
  .buildSubmodule();
