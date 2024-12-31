import { createModule } from "grubba-rpc";
import { Meteor } from "meteor/meteor";

import { UsersCollection } from "../users/collection";
import { TeamsCollection } from "./collection";
import {
  addMemberSchema,
  createTeamSchema,
  editTeamSchema,
  getUserTeamsSchema,
  removeMemberSchema
} from "./schemas";

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
  .addMethod("editTeam", editTeamSchema, async ({ teamId, name }) => {
    const currentUserId = Meteor.userId();

    const team = await TeamsCollection.findOneAsync({ _id: teamId });
    if (!team) throw new Meteor.Error("Team not found");
    if (team.ownerId !== currentUserId) {
      throw new Meteor.Error("Not authorized to add members");
    }

    await TeamsCollection.updateAsync(teamId, {
      $set: { name }
    });
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
  .addMethod("addMember", addMemberSchema, async ({ teamId, email }) => {
    const currentUserId = Meteor.userId();

    const team = await TeamsCollection.findOneAsync({ _id: teamId });
    if (!team) throw new Meteor.Error("Team not found");
    if (team.ownerId !== currentUserId) {
      throw new Meteor.Error("Not authorized to add members");
    }

    const user = await UsersCollection.findOneAsync({ "emails.address": email });

    if (!user) {
      throw new Error("User not found");
    }

    await TeamsCollection.updateAsync(teamId, {
      $addToSet: {
        members: {
          _id: user?._id,
          joinedAt: new Date()
        }
      }
    });
  })
  .addMethod("removeMember", removeMemberSchema, async ({ teamId, memberId }) => {
    const currentUserId = Meteor.userId();
    if (!currentUserId) throw new Meteor.Error("Not authorized");

    const team = await TeamsCollection.findOneAsync({ _id: teamId });
    if (!team) throw new Meteor.Error("Team not found");
    if (team.ownerId !== currentUserId) {
      throw new Meteor.Error("Not authorized to remove members");
    }
    if (memberId === currentUserId) {
      throw new Meteor.Error("You cannot remove yourself from the team.");
    }

    await TeamsCollection.updateAsync(teamId, {
      $pull: { members: { _id: memberId } }
    });
  })
  .buildSubmodule();
