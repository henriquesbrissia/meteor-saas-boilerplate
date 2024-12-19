import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

import { UsersCollection } from "../users/collection";
import { TeamsCollection } from "./collection";
import { createTeamSchema, getUserTeamsSchema } from "./schemas";

export const teamsModule = createModule("teams")
  .addMethod("createTeam", createTeamSchema, async ({ name }) => {
    const userId = Meteor.userId();
    if (!userId) throw new Meteor.Error("not-authorized");

    const newTeam = await TeamsCollection.insertAsync({
      name,
      ownerId: userId,
      members: [{ _id: userId, joinedAt: new Date() }],
      createdAt: new Date()
    });

    return { newTeam };
  })
  .addMethod("getUserTeams", getUserTeamsSchema, async () => {
    const userId = Meteor.userId();
    if (!userId) throw new Meteor.Error("Not authorized");

    const teams = await TeamsCollection.find({ "members._id": userId }).fetchAsync();
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const members = await Promise.all(
          team.members.map(async (memberId) => {
            const member = await UsersCollection.findOneAsync({ _id: memberId._id });
            return member;
          })
        );
        return { ...team, members };
      })
    );

    return teamsWithMembers;
  })
  .buildSubmodule();
