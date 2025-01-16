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
    const currentUserId = Meteor.userId();
    if (!currentUserId) throw new Meteor.Error("Not authorized");

    const newTeam = await TeamsCollection.insertAsync({
      name,
      ownerId: currentUserId,
      members: [{ _id: currentUserId, role: "admin", joinedAt: new Date() }],
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
    const currentUserId = Meteor.userId();
    if (!currentUserId) throw new Meteor.Error("Not authorized");

    const teams = await TeamsCollection.find({ "members._id": currentUserId }).fetchAsync();
    const teamsWithMembers = await Promise.all(
      teams.map(async (team) => {
        const users = await Promise.all(
          team.members.map(async (member) => {
            const user = await UsersCollection.findOneAsync({ _id: member._id });
            return {
              ...user,
              role: member.role,
              joinedAt: member.joinedAt
            };
          })
        );
        const currentUser = team.members.find((member) => member._id === currentUserId);
        const isAdmin = currentUser?.role === "admin";

        return { ...team, users, isAdmin };
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
    if (!user) throw new Meteor.Error("User not found");

    await TeamsCollection.updateAsync(teamId, {
      $addToSet: {
        members: {
          _id: user?._id,
          role: "member",
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

    await TeamsCollection.updateAsync(teamId, {
      $pull: { members: { _id: memberId } }
    });
  })
  .buildSubmodule();
